import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { FaBullhorn } from "react-icons/fa";
import { BsPersonFillGear } from "react-icons/bs";
import { GoTrash } from "react-icons/go";
import { FaClock, FaUsers, FaRuler, FaPhone, FaRegEdit } from 'react-icons/fa';
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { useAuth } from "../context/AuthProvider";
import { useModal } from "../context/ModalConfirmProvider";
import usePermisos from "../hooks/usePermisos";

import { borrarMultimedia, borrarPublicacion, cambiarEstadoCertificacion, obtenerCalificacion, obtenerCantidadFavoritas, obtenerComentariosTiempoReal, obtenerEstadoFavorita, obtenerMultimedia, obtenerPublicacion, obtenerSolicitudCertificacion, solicitarCertificacion, agregarReporte, obtenerUsuario } from "../firebase";

import Protegido from "../components/Protegido";
import SliderPublicacion from "../components/SliderPublicacion";
import Favorita from "../components/publicacion/Favorita";
import MapaUbicacion from "../components/MapaUbicacion";
import CalendarioDisponibilidad from "../components/CalendarioDisponibilidad";
import Calificacion from "../components/publicacion/Calificacion";
import Comentarios from "../components/publicacion/Comentarios";

const renderizarSaltos = (texto, tipoLista) => {
    if (!texto) return null;

    // El texto se divide por los saltos de línea
    const lineas = texto.split('\n');

    // Renderizar como una lista desordenada o ordenada según el tipo
    if (tipoLista === 'ul') {
        return (
            <ul style={{ paddingLeft: '20px' }}>
                {
                    lineas.map((linea, index) => (
                        <li key={index}>{linea}</li>
                    ))
                }
            </ul>
        );
    } else {
        return (
            <div>
                {
                    lineas.map((linea, index) => (
                        <p key={index}>{linea}</p>
                    ))
                }
            </div>
        );
    }
};

function Publicacion(){
    const navigate = useNavigate();
    const { idPublicacion } = useParams();
    
    const { usuario } = useAuth();
    const { abrirModal, cerrarModal } = useModal();

    // Obtiene permisos por rol para permitir o proteger las acciones
    const { permiso: permisoComentar, error: errorComentar } = usePermisos(["accion/comentar-terraza"]);

    const [creador, setCreador] = useState(null);

    const [cargando, setCargando] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
    const [multimedia, setMultimedia] = useState([]);
    const [solicitudCertificacion, setSolicitudCertificacion] = useState(undefined);

    const [cantidadFavoritas, setCantidadFavoritas] = useState(0);
    const [favorita, setFavorita] = useState(false);
    const [calificaciones, setCalificaciones] = useState({
        total: 0,
        usuario: 0
    });
    const [comentarios, setComentarios] = useState([]);

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

        abrirModal({
            texto: "¿Realmente quieres reportar la publicación?",
            onResult: (res) => {
                if(res){
                    toast.promise(agregarReporte({ 
                        idPublicacion,
                        idUsuario: usuario.id
                    }), {
                        loading: "Reportando publicación...",
                        success: "Publicación reportada", //MANDA ESTE MENSAJE AUNQUE EL REPORTE NO SE HAYA MANDADO PQ YA HAY UNO EXISTENTE CON LOS MISMOS idPublicacion y idUsuario
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
            let [publicacion, multimedia, { calificacionTotal }, cantidadFavoritas, solicitudCertificacion] = await Promise.all([
                obtenerPublicacion(idPublicacion),
                obtenerMultimedia(idPublicacion),
                obtenerCalificacion({ idPublicacion }),
                obtenerCantidadFavoritas(idPublicacion),
                obtenerSolicitudCertificacion(idPublicacion)
            ]);

            // Se obtiene el creador para que el admin pueda ver sus datos
            const creador = await obtenerUsuario(publicacion.idUsuario);

            // Suscripción para obtener los comentarios en tiempo real
            unsubscribe = obtenerComentariosTiempoReal(idPublicacion, (comentarios) => {
                setComentarios(comentarios);
            });

            setCreador(creador);
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
            <section className="publicacion__titulo">
                {
                    publicacion.certificada && (
                            <RiVerifiedBadgeFill className="publicacion__certificacion-icono" />
                    )
                }
                <h3 className="titulo">{publicacion.nombreTerraza}</h3>
            </section>

            <SliderPublicacion multimedia={multimedia} />

            {/* Boton editar solo para el dueño o un administrador */}
            <Protegido
                names={["editar-terraza", "publicacion/editar-terraza"]}
                paramURL="idPublicacion"
                type="component"
                cargandoComponent={""}
                errorComponent={""}
            >
                {/* Solo el administrador puede ver los datos del creador */}
                <Protegido
                    names={["administracion"]}
                    type="component"
                    cargandoComponent={""}
                    errorComponent={""}
                >
                    <div className="publicacion__creador">
                        <BsPersonFillGear className="publicacion__icono-dibujo" />
                        <Link to={`/perfil/${creador.id}`}>{ creador.nombre }</Link>
                    </div>
                </Protegido>

                <section className="publicacion__administracion">
                    {
                        !publicacion?.certificada && (
                            <button className="publicacion__boton boton boton--amarillo" type="button" onClick={() => handleSolicitarCertificacion()}> { !solicitudCertificacion ? "Solicitar certificación" : "Cancelar solicitud de certificación" }</button>
                        )
                    }
                    <Link to={`/editar-terraza/${publicacion.id}`} className="publicacion__boton boton boton--amarillo"> <FaRegEdit className="publicacion__boton--icono"/> Editar</Link>
                    <button className="publicacion__boton boton boton--outlined" type="button" onClick={() => handleBorrarPublicacion()}> <GoTrash className="publicacion__boton--icono"/> Borrar publicación</button>
                    <Protegido
                        names={["administracion"]}
                        type="component"
                        cargandoComponent={""}
                        errorComponent={""}
                    >
                        <button className="publicacion__boton boton" type="button" onClick={handleCertificar}>{ !publicacion?.certificada ? "Certificar" : "Quitar certificación" }</button>
                    </Protegido>
                </section>
            </Protegido>
            
            <section className="publicacion__acciones">
                <button className="publicacion__reportar" onClick={handleReporte}>
                    Reportar
                    <FaBullhorn className="publicacion__reportar-boton" />
                </button>

                <Favorita
                    cantidadFavoritas={cantidadFavoritas}
                    setCantidadFavoritas={setCantidadFavoritas}
                    favorita={favorita}
                    setFavorita={setFavorita}
                />
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
                    <h4>{publicacion.nombreTerraza}</h4>

                    {renderizarSaltos(publicacion.descripcion)}

                    <p><b>Reglamento:</b></p>
                    {renderizarSaltos(publicacion.reglamento, 'ul')}

                    <hr className="line" />

                    <p><b>Servicios extras:</b></p>
                    {renderizarSaltos(publicacion.servicios, 'ul')}
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
                <div className="publicacion__etiquetas">
                        {
                            publicacion.etiquetas.map((etiqueta, indice) => <span className="previsualizacion__etiqueta" key={indice}>#{ etiqueta}</span>)
                        }
                </div>

                <MapaUbicacion ubicacion={publicacion.direccion} />

                <div className="publicacion__disponibilidad">
                    <hr className="line" />
                    <span className="publicacion__disponibilidad-titulo titulo">Disponibilidad</span>
                    <CalendarioDisponibilidad className="publicacion__disponibilidad-calendario" value={publicacion.disponibilidad} readonly />
                    <hr className="line" />
                </div>

                {
                    publicacion.certificada && (
                        <div className="publicacion__certificacion">
                            <RiVerifiedBadgeFill className="publicacion__certificacion-icono" />
                            <span>Esta publicación ha sido certificada por Harty</span>
                        </div>
                    )
                }

                <Calificacion calificaciones={calificaciones} setCalificaciones={setCalificaciones} />

                <Comentarios comentarios={comentarios} />
            </section>
        </main>
    )
}

export default Publicacion;