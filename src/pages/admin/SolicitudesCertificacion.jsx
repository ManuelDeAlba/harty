import { useEffect, useState } from "react";
import { obtenerSolicitudesCertificacion } from "../../firebase";
import { Link } from "react-router-dom";

function SolicitudesCertificacion(){
    const [cargando, setCargando] = useState(false);
    const [solicitudes, setSolicitudes] = useState([]);

    useEffect(() => {
        const obtenerSolicitudes = async () => {
            setCargando(true);

            const solicitudes = await obtenerSolicitudesCertificacion();
            
            setSolicitudes(solicitudes);
            setCargando(false);
        }

        obtenerSolicitudes();
    }, [])

    if(cargando) return <span>Cargando...</span>

    if(!solicitudes) return <span>No hay solicitudes de certificación</span>

    return(
        <main className="contenedor">
            <h1 className="solicitudes__titulo titulo">Solicitudes de Certificación</h1>
            <div className="solicitudes">
                {
                    solicitudes.map(({solicitud, usuario, publicacion}) => (
                        <div className="solicitud" key={solicitud.id}>
                            <Link className="solicitud__link boton" to={`/publicacion/${publicacion.id}`}>{publicacion.nombreTerraza}</Link>
                            <b>Datos de contacto</b>
                            <span className="solicitud__nombre texto-overflow">{usuario.nombre}</span>
                            <span className="solicitud__correo texto-overflow">{usuario.correo}</span>
                            <span className="solicitud__telefono">{publicacion.telefono}</span>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default SolicitudesCertificacion;