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

    if(cargando) return <span className="contenedor">Cargando...</span>

    if(!solicitudes) return <span className="contenedor">No hay solicitudes de certificación</span>

    return(
        <main className="contenedor">
            <h1 className="solicitudes__titulo titulo">Solicitudes de Certificación</h1>
            <div className="solicitudes">
                {
                    solicitudes.map(({solicitud, usuario, publicacion}) => (
                        <div className="solicitud" key={solicitud.id}>
                            <Link className="solicitud__link boton" to={`/publicacion/${publicacion.id}`}>{publicacion.nombreTerraza}</Link>
                            <b>Datos de contacto</b>
                            <Link className="solicitud__nombre texto-overflow" to={`/perfil/${usuario.id}`}>{usuario.nombre}</Link>
                            <span className="solicitud__correo texto-overflow"><b>Correo:</b> {usuario.correo}</span>
                            <span className="solicitud__telefono"><b>Tel:</b> {publicacion.telefono}</span>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default SolicitudesCertificacion;