import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { FaBullhorn } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaClock, FaUsers, FaRuler, FaPhone } from 'react-icons/fa';
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { useAuth } from "../context/AuthProvider";
import { useModal } from "../context/ModalConfirmProvider";
import usePermisos from "../hooks/usePermisos";

import { borrarComentario, borrarMultimedia, borrarPublicacion, cambiarEstadoCertificacion, enviarComentario, guardarCalificacion, guardarFavorita, obtenerCalificacion, obtenerCantidadFavoritas, obtenerComentariosTiempoReal, obtenerEstadoFavorita, obtenerMultimedia, obtenerPublicacion, obtenerSolicitudCertificacion, solicitarCertificacion, agregarReporte } from "../firebase";
import { truncarCalificacion } from "../utils";

import Protegido from "../components/Protegido";
import SliderPublicacion from "../components/SliderPublicacion";
import MapaUbicacion from "../components/MapaUbicacion";
import CalendarioDisponibilidad from "../components/CalendarioDisponibilidad";

function Publicacion(){
    const navigate = useNavigate();
    const { idPublicacion } = useParams();
    const { usuario } = useAuth();
    const { abrirModal, cerrarModal } = useModal();

    const [cargando, setCargando] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
    const [multimedia, setMultimedia] = useState([]);
    const [solicitudCertificacion, setSolicitudCertificacion] = useState(undefined);

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

    const handleBorrarPublicacion = () => {
        abrirModal({
            texto: "¿Realmente quieres borrar la publicación?",
            onResult: (res) => {
                if(res){
                    let promesa = new Promise(async (res) => {
                        // Eliminar imagenes
                        await borrarMultimedia(multimedia.map(img => img.referencia));
                        // Eliminar publicacion
                        await borrarPublicacion(idPublicacion);
                        res();
                    })
        
                    toast.promise(promesa, {
                        loading: "Borrando terraza...",
                        success: () => {
                            navigate("/publicaciones"); // Redirige a ver las publicaciones
                            return "Terraza borrada";
                        },
                        error: "Hubo un error"
                    });
                }

                cerrarModal();
            }
        })
    }

    const handleSolicitarCertificacion = async () => {
        const existeSolicitud = solicitudCertificacion ? true : false;
        await solicitarCertificacion({ idPublicacion, idUsuario: publicacion.idUsuario, nuevoEstado: !existeSolicitud });

        const solicitud = await obtenerSolicitudCertificacion(idPublicacion);
        setSolicitudCertificacion(solicitud);
    }

    const handleCertificar = async () => {
        await cambiarEstadoCertificacion({
            idPublicacion,
            nuevoEstado: !publicacion?.certificada ?? true // Si no está certificada el nuevo estado es true
        });

        // Se cambia el estado para el renderizado
        setPublicacion(prev => ({
            ...prev,
            certificada: !publicacion?.certificada ?? true
        }))

        // await obtenerPublicacion(idPublicacion);
    }

    const handleReporte = () =>{
        // Si no tiene permisos para realizar esa acción
        if(!permisoComentar){
            toast.error(errorComentar.message);
            if(errorComentar.code != "harty/unverified-account" && errorComentar.code != "harty/disabled-account") navigate("/iniciar-sesion");
            return;
        }

        toast.promise(agregarReporte({ 
            idPublicacion,
            idUsuario: usuario.id
        }), {
            loading: "Reportando publicación...",
            success: "Publicación reportada", //MANDA ESTE MENSAJE AUNQUE EL REPORTE NO SE HAYA MANDADO PQ YA HAY UNO EXISTENTE CON LOS MISMOS idPublicacion y idUsuario
            error: (error) => error.message
        });
    }

    useEffect(() => {
        let unsubscribe;

        const obtenerDatos = async () => {
            setCargando(true);

            // Se obtienen los datos en paralelo
            let [publicacion, multimedia, { calificacionTotal }, cantidadFavoritas, solicitudCertificacion] = await Promise.all([
                obtenerPublicacion(idPublicacion),
                obtenerMultimedia(idPublicacion),
                obtenerCalificacion({ idPublicacion }),
                obtenerCantidadFavoritas(idPublicacion),
                obtenerSolicitudCertificacion(idPublicacion)
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
            setSolicitudCertificacion(solicitudCertificacion);

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
        <main className="publicacion contenedor">
            <h3 className="titulo">{publicacion.nombreTerraza}</h3>

            <SliderPublicacion multimedia={multimedia} />

            {
                publicacion.certificada && (
                    <section className="publicacion__certificacion">
                        <RiVerifiedBadgeFill className="publicacion__certificacion-icono" />
                        <span>Terraza certificada por Harty</span>
                    </section>
                )
            }

            {/* Boton editar solo para el dueño o un administrador */}
            <Protegido
                names={["editar-terraza", "publicacion/editar-terraza"]}
                paramURL="idPublicacion"
                type="component"
                cargandoComponent={""}
                errorComponent={""}
            >
                <section className="publicacion__administracion">
                    <button className="publicacion__boton boton boton--rojo" type="button" onClick={() => handleBorrarPublicacion()}>Borrar publicación</button>
                    <Link to={`/editar-terraza/${publicacion.id}`} className="publicacion__boton boton">Editar</Link>
                    {
                        !publicacion?.certificada && (
                            <button className="publicacion__boton boton" type="button" onClick={() => handleSolicitarCertificacion()}>{ !solicitudCertificacion ? "Solicitar certificación" : "Cancelar solicitud de certificación" }</button>
                        )
                    }
                    <Protegido
                        names={["administracion"]}
                        type="component"
                    >
                        <button className="publicacion__boton boton" type="button" onClick={handleCertificar}>{ !publicacion?.certificada ? "Certificar" : "Quitar certificación" }</button>
                    </Protegido>
                </section>
            </Protegido>
            
            <section className="publicacion__acciones">
                <button className="publicacion__reportar boton boton--rojo" onClick={handleReporte}>
                    Reportar
                    <FaBullhorn className="publicacion__reportar-boton" />
                </button>
                <div className="favoritos">
                    <span><b>{cantidadFavoritas}</b></span>
                    <span onClick={() => handleFavorita(!favorita)} className="favoritos__corazon">
                        {
                            favorita ?
                                <AiFillHeart /> :
                                <AiOutlineHeart />
                        }
                    </span>
                </div>
            </section>

            <section className="publicacion__iconos">
                <div className="publicacion__icono">
                    <FaClock className="publicacion__icono-dibujo" />
                    <p className="texto-overflow">{publicacion.horarios}</p>
                </div>

                <div className="publicacion__icono">
                    <FaRuler className="publicacion__icono-dibujo" />
                    <p className="texto-overflow">{publicacion.tamano}</p>
                </div>

                <div className="publicacion__icono">
                    <FaUsers className="publicacion__icono-dibujo" />
                    <p className="texto-overflow">{publicacion.capacidad}</p>
                </div>
            </section>

            <section className="publicacion__texto">
                <div className="publicacion__izquierda">
                    <p>{publicacion.descripcion}</p>
                    <div className="publicacion__etiquetas">
                        {
                            publicacion.etiquetas.map((etiqueta, indice) => <span className="previsualizacion__etiqueta" key={indice}>{ etiqueta }</span>)
                        }
                    </div>
                    <p><b>Reglamento:</b> {publicacion.reglamento}</p>
                    <hr className="line" />
                    <p><b>Servicios extras:</b> {publicacion.servicios}</p>
                    {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
                </div>
                <div className="publicacion__derecha">
                    <span className="previsualizacion__precio"><b>$</b> {publicacion.precio}</span>
                    <div className="publicacion__icono">
                        <FaPhone className="publicacion__icono-dibujo publicacion__icono-dibujo--llamar" />
                        <span>{publicacion.telefono}</span>
                    </div>
                    <p className="publicacion__redes texto-overflow"><b>Redes sociales:</b> {publicacion.redes}</p>
                    <a className="publicacion__cta-llamar boton" href={`tel:${publicacion.telefono}`}>Llama ahora</a>
                </div>
            </section>

            <hr className="line" />

            <section className="publicacion__inferior">
                <MapaUbicacion ubicacion={publicacion.direccion} />

                <div className="publicacion__disponibilidad">
                    <span className="publicacion__disponibilidad-titulo titulo">Disponibilidad</span>
                    <CalendarioDisponibilidad className="publicacion__disponibilidad-calendario" value={publicacion.disponibilidad} readonly />
                </div>
                <div className="calificacion">
                    <span className="calificacion__titulo"><b>Calificacion total:</b> {truncarCalificacion(calificaciones.total)}</span>
                    <div className="calificacion__estrellas">
                        <span className={`calificacion__estrella${calificaciones.usuario >= 1 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(1)}>&#9733;</span>
                        <span className={`calificacion__estrella${calificaciones.usuario >= 2 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(2)}>&#9733;</span>
                        <span className={`calificacion__estrella${calificaciones.usuario >= 3 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(3)}>&#9733;</span>
                        <span className={`calificacion__estrella${calificaciones.usuario >= 4 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(4)}>&#9733;</span>
                        <span className={`calificacion__estrella${calificaciones.usuario >= 5 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(5)}>&#9733;</span>
                    </div>
                </div>
                <section className="comentarios">
                    <span><b>Comentarios</b></span>
                    <form className="comentarios__form" onSubmit={handleComentario}>
                        <textarea
                            className="comentarios__textarea"
                            name="comentario"
                            placeholder="Comentario..."
                            cols="30"
                            rows="2"
                        ></textarea>
                        <input className="comentarios__boton boton" type="submit" value="Enviar" />
                    </form>
                    <section className="comentarios__lista">
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
                                        <button className="comentarios__comentario-boton boton boton--rojo" onClick={() => handleBorrarComentario(id)}>Eliminar</button>
                                    </Protegido>
                                </div>
                            ))    
                        }
                    </section>
                </section>
            </section>
        </main>
    )
}

export default Publicacion;