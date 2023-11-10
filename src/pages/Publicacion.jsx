import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaBullhorn } from "react-icons/fa";

import { guardarCalificacion, obtenerCalificacion, obtenerMultimedia, obtenerPublicacion } from "../firebase";

import MapaUbicacion from "../components/MapaUbicacion";
import { useAuth } from "../context/AuthProvider";

function Publicacion(){
    const { idPublicacion } = useParams();
    const { usuario } = useAuth();

    const [cargando, setCargando] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
    const [multimedia, setMultimedia] = useState([]);

    const [calificaciones, setCalificaciones] = useState({
        total: 0,
        usuario: 0
    });

    const handleCalificacion = async cal => {
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

    useEffect(() => {
        const obtenerDatos = async () => {
            setCargando(true);

            // Se obtienen los datos en paralelo
            let [publicacion, multimedia, { calificacionTotal, calificacionUsuario }] = await Promise.all([
                obtenerPublicacion(idPublicacion),
                obtenerMultimedia(idPublicacion),
                obtenerCalificacion({ idPublicacion })
            ])

            setPublicacion(publicacion);
            setMultimedia(multimedia);
            // Aquí solo se guarda la calificación total por si no existe el usuario
            setCalificaciones(prev => ({
                ...prev,
                total: calificacionTotal
            }));

            setCargando(false);
        }

        obtenerDatos();
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
        }
    }, [usuario])

    if(cargando) return <h3>Cargando...</h3>

    if(!publicacion) return <h3>No existe la publicación</h3>

    return(
        <main className="publicacion">
            <section className="publicacion__texto">
                <h1>{publicacion.nombreTerraza}</h1>
                <p><b>Descripción:</b> {publicacion.descripcion}</p>
                <p><b>Reglamento:</b> {publicacion.reglamento}</p>
                {/* Dirección temporal */}
                <p><b>Direccion:</b></p>
                <MapaUbicacion ubicacion={publicacion.direccion} />
                <p><b>Teléfono:</b> {publicacion.telefono}</p>
                <p><b>Redes sociales:</b> {publicacion.redes}</p>
                <p><b>Precio:</b> {publicacion.precio}</p>
                <p><b>Horarios:</b> {publicacion.horarios}</p>
                <p><b>Tamaño:</b> {publicacion.tamano}</p>
                <p><b>Capacidad de personas:</b> {publicacion.capacidad}</p>
                <p><b>Servicios extras:</b> {publicacion.servicios}</p>
                <p><b>Etiquetas:</b> {publicacion.etiquetas.map((etiqueta, indice) => <span key={indice}>{ etiqueta }</span>)}</p>
                <p><b>Multimedia:</b>
                    {
                        multimedia.length > 0 ? (
                            multimedia.map((imagen, indice) => (
                                <img width="100" src={imagen.src} key={indice} />
                            ))    
                        ) : (
                            " No hay multimedia para mostrar"
                        )
                    }
                </p>
                {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
            </section>

            <section className="publicacion__acciones">
                <span><b>Acciones (reportar), calificar, etc.</b></span>
                <span>Reportar terraza <FaBullhorn /></span>
                <div className="calificacion">
                    <span className="calificacion__titulo">Calificacion total: {calificaciones.total}</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 1 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(1)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 2 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(2)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 3 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(3)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 4 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(4)}>&#9733;</span>
                    <span className={`calificacion__estrella${calificaciones.usuario >= 5 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(5)}>&#9733;</span>
                </div>
            </section>

            <section className="publicacion__comentarios">
                <span><b>Comentarios</b></span>
                <ul>
                    <li>Lista</li>
                    <li>de</li>
                    <li>Comentarios</li>
                </ul>
            </section>
        </main>
    )
}

export default Publicacion;