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
        <main className="solicitudes contenedor">
            <h1 className="solicitudes__titulo titulo">Solicitudes de Certificación</h1>
            {
                solicitudes.map(({solicitud, usuario, publicacion}) => (
                    <div className="solicitud" key={solicitud.id}>
                        <span className="solicitud__nombre">{usuario.nombre}</span>
                        <span className="solicitud__correo">{usuario.correo}</span>
                        <span className="solicitud__telefono">{usuario.telefono}</span>
                        <Link className="solicitud__link" to={`/publicacion/${publicacion.id}`}>{publicacion.nombreTerraza}</Link>
                    </div>
                ))
            }
        </main>
    )
}

export default SolicitudesCertificacion;