import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { FaBullhorn } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaClock, FaUsers, FaRuler, FaPhone, FaShareAlt } from 'react-icons/fa';

import { useAuth } from "../context/AuthProvider";
import { useModal } from "../context/ModalConfirmProvider";

import { borrarComentario, enviarComentario, guardarCalificacion, guardarFavorita, obtenerCalificacion, obtenerCantidadFavoritas, obtenerComentariosTiempoReal, obtenerEstadoFavorita, obtenerMultimedia, obtenerPublicacion } from "../firebase";
import { truncarCalificacion } from "../utils";

import SliderPublicacion from "../components/SliderPublicacion";
import MapaUbicacion from "../components/MapaUbicacion";
import Protegido from "../components/Protegido";
import usePermisos from "../hooks/usePermisos";

function Publicacion(){
    const navigate = useNavigate();
    const { idPublicacion } = useParams();
    const { usuario } = useAuth();
    const { abrirModal, cerrarModal } = useModal();

    const [cargando, setCargando] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
    const [multimedia, setMultimedia] = useState([]);

    // Obtiene permisos por rol para permitir o proteger las acciones
    const { permiso: permisoFavorita, error: errorFavorita } = usePermisos(["accion/favorita-terraza"]);
    const { permiso: permisoCalificar, error: errorCalificar } = usePermisos(["accion/calificar-terraza"]);
    const { permiso: permisoComentar, error: errorComentar } = usePermisos(["accion/comentar-terraza"]);

    const [cantidadFavoritas, setCantidadFavoritas] = useState(0);
    const [favorita, setFavorita] = useState(false);
    const [calificaciones, setCalificaciones] = useState({
        total: 0,
        usuario: 0
    });
    const [comentarios, setComentarios] = useState([]);

    const handleFavorita = async (estado) => {
        // Si no tiene permisos para realizar esa acción
        if(!permisoFavorita){
            toast.error(errorFavorita.message);
            if(errorFavorita.code != "harty/unverified-account" && errorFavorita.code != "harty/disabled-account") navigate("/iniciar-sesion");
            return;
        }

        // Se cambia en la base de datos
        await guardarFavorita({
            idPublicacion,
            idUsuario: usuario.id,
            favorita: estado
        })

        // Se actualiza la cantidad de personas que le han dado en favorita
        const cant = await obtenerCantidadFavoritas(idPublicacion);
        
        setFavorita(estado);
        setCantidadFavoritas(cant);
    }

    const handleCalificacion = async cal => {
        // Si no tiene permisos para realizar esa acción
        if(!permisoCalificar){
            toast.error(errorCalificar.message);
            if(errorCalificar.code != "harty/unverified-account" && errorCalificar.code != "harty/disabled-account") navigate("/iniciar-sesion");
            return;
        }
        
        let nuevaCal = cal == calificaciones.usuario ? 0 : cal;

        // Se cambia en la base de datos
        await guardarCalificacion({
            idPublicacion,
            idUsuario: usuario.id,
            calificacion: nuevaCal
        });

        // Se obtienen los nuevos valores
        const { calificacionTotal, calificacionUsuario } = await obtenerCalificacion({
            idPublicacion,
            idUsuario: usuario.id
        });

        // Se actualiza el estado para el renderizado
        setCalificaciones({
            total: calificacionTotal,
            usuario: calificacionUsuario
        });
    }

    const handleComentario = async (e) => {
        e.preventDefault();

        // Si no tiene permisos para realizar esa acción
        if(!permisoComentar){
            toast.error(errorComentar.message);
            if(errorComentar.code != "harty/unverified-account" && errorComentar.code != "harty/disabled-account") navigate("/iniciar-sesion");
            return;
        }

        const comentario = e.target.comentario.value;
        
        // Se limpia el formulario
        e.target.reset();

        toast.promise(enviarComentario({
            idPublicacion,
            idUsuario: usuario.id,
            comentario
        }), {
            loading: "Publicando comentario...",
            success: "Comentario publicado",
            error: (error) => error.message
        });
    }

    const handleBorrarComentario = async (idComentario) => {
        abrirModal({
            texto: "¿Realmente quieres borrar el comentario?",
            onResult: (res) => {
                if(res){
                    toast.promise(borrarComentario(idComentario), {
                        loading: "Borrando comentario...",
                        success: "Comentario borrado",
                        error: (error) => error.message
                    });
                }

                cerrarModal();
            }
        })
    }

    useEffect(() => {
        let unsubscribe;

        const obtenerDatos = async () => {
            setCargando(true);

            // Se obtienen los datos en paralelo
            let [publicacion, multimedia, { calificacionTotal }, cantidadFavoritas] = await Promise.all([
                obtenerPublicacion(idPublicacion),
                obtenerMultimedia(idPublicacion),
                obtenerCalificacion({ idPublicacion }),
                obtenerCantidadFavoritas(idPublicacion)
            ]);

            // Suscripción para obtener los comentarios en tiempo real
            unsubscribe = obtenerComentariosTiempoReal(idPublicacion, (comentarios) => {
                setComentarios(comentarios);
            });

            setPublicacion(publicacion);
            setMultimedia(multimedia);
            // Aquí solo se guarda la calificación total por si no existe el usuario
            setCalificaciones(prev => ({
                ...prev,
                total: calificacionTotal
            }));
            setCantidadFavoritas(cantidadFavoritas);

            setCargando(false);
        }

        obtenerDatos();

        // Se desuscribe al cambiar idPublicacion para la siguiente vez que se quiera poner el listener
        return unsubscribe;
    }, [idPublicacion])

    useEffect(() => {
        if(usuario){
            obtenerCalificacion({
                idPublicacion,
                idUsuario: usuario.id
            })
            .then(({ calificacionTotal, calificacionUsuario }) => {
                setCalificaciones({
                    total: calificacionTotal,
                    usuario: calificacionUsuario
                })
            });

            obtenerEstadoFavorita({
                idPublicacion,
                idUsuario: usuario.id
            })
            .then(setFavorita);
        }
    }, [usuario])

    if(cargando) return <span className="contenedor">Cargando...</span>

    if(!publicacion) return <h3>No existe la publicación</h3>

    return(
        <main className="publicacion">
            <h3>{publicacion.nombreTerraza}</h3>
            <SliderPublicacion multimedia={multimedia} />
            <section className="publicacion__acciones texto-overflow">
                <span><b>Reportar terraza</b> <FaBullhorn /></span>
                <div className="favoritos">
                        <span><b>{cantidadFavoritas}</b> </span>
                        <span onClick={() => handleFavorita(!favorita)} className="favoritos__corazon">
                            {
                                favorita ?
                                    <AiFillHeart /> :
                                    <AiOutlineHeart />
                            }
                        </span>
                </div>
            </section>
            <section className="publicacion__texto">
                <div className="columna-izquierda">
                    <div className="column">
                        <FaClock style={{ fontSize: '1.5em',marginRight:'.5em'}}/>
                        <p className="footer texto-overflow">{publicacion.horarios}</p>
                        <FaRuler style={{ fontSize: '2em', margin: '0 0.5em 0 1em' }} />
                        <p className="footer texto-overflow">{publicacion.tamano}</p>
                        <FaUsers style={{ fontSize: '1.8em', margin: '0 0.5em 0 1em' }} />
                        <p className="footer texto-overflow">{publicacion.capacidad}</p>
                    </div>
                    <p>{publicacion.descripcion}</p>
                    <p>{publicacion.etiquetas.map((etiqueta, indice) => <span className="previsualizacion__etiqueta" key={indice}>{ etiqueta }</span>)}</p>
                    <p><b>Reglamento:</b> {publicacion.reglamento}</p>
                    <hr className="line" />
                    <p><b>Servicios extras:</b> {publicacion.servicios}</p>
                       {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
                </div>
                <div className="columna-derecha">
                    <span className="previsualizacion__precio"><b>$</b> {publicacion.precio}</span>
                    <p> <FaPhone style={{ fontSize: '1.8em', verticalAlign: 'middle', marginRight: '0.5em' }} />{publicacion.telefono}</p>
                    <p className="texto-overflow"><b>Redes sociales:</b> {publicacion.redes}</p>
                    <div className="llama-ahora">
                        <a href={`tel:${publicacion.telefono}`}>Llama ahora</a>
                    </div>
                    {/* Añade más elementos según sea necesario */}
                </div>
            </section>
            <hr className="line" />
            <section className="publicacion__inferior">
                <span><b>Ubicación </b></span>
                <MapaUbicacion ubicacion={publicacion.direccion} />
                <div className="calificacion">
                    <span className="calificacion__titulo"><b>Calificacion total:</b> {truncarCalificacion(calificaciones.total)}</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 1 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(1)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 2 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(2)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 3 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(3)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 4 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(4)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 5 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(5)}>&#9733;</span>
                </div>
                <section className="comentarios">
                    <span><b>Comentarios</b></span>
                    <form className="comentarios__form" onSubmit={handleComentario}>
                        <textarea
                            className="comentarios__textarea"
                            name="comentario"
                            placeholder="Comentario..."
                            cols="30"
                            rows="3"
                        ></textarea>
                        <input type="submit" value="Enviar" />
                    </form>
                    <ul>
                        {
                            comentarios.map(({id, comentario, usuario: { nombre }}) => (
                                <div className="comentarios__contenedor-comentario" key={id}>
                                    <span className="comentarios__comentario"><b>{nombre})</b> {comentario}</span>
                                    <Protegido
                                        // Puede borrar comentario si es admin o el dueño del comentario
                                        names={["borrar-comentario", "comentario/borrar-comentario"]}
                                        type="component"
                                        params={{idComentario: id}}
                                        cargandoComponent={""}
                                        errorComponent={""}
                                    >
                                        <button className="boton boton--rojo" onClick={() => handleBorrarComentario(id)}>Eliminar</button>
                                    </Protegido>
                                </div>
                            ))    
                        }
                    </ul>
                </section>
            </section>
        </main>
    )
}

export default Publicacion;