import { useEffect } from "react";
import { obtenerReportes } from "../../firebase";
import { useState } from "react";
import { Link } from "react-router-dom";

function ReportesPublicaciones(){
    const [cargando, setCargando] = useState(false);
    const [reportes, setReportes] = useState(null);

    useEffect(() => {
        setCargando(true);
        obtenerReportes()
        .then(reportes => {
            setReportes(reportes);
            setCargando(false);
        });
    }, [])

    if(cargando) return <span className="contenedor">Cargando...</span>

    if(!reportes) return <span className="contenedor">No hay reportes</span>

    return(
        <main className="contenedor">
            <h1>Reportes de publicaciones</h1>

            <div className="reportes">
                {
                    reportes.map(({ publicacion, reportes, usuarios }) => (
                        <div className="reporte" key={publicacion.id}>
                            <Link className="reporte__link" to={`/publicacion/${publicacion.id}`}>{publicacion.nombreTerraza}</Link>
                            <b>{reportes.length} {reportes.length == 1 ? "reporte" : "reportes"}</b>
                            <ul className="reporte__usuarios">
                                {
                                    usuarios.map(usuario => (
                                        <li><Link className="reporte__link" to={`/perfil/${usuario.id}`}>{usuario.nombre}</Link></li>
                                    ))
                                }
                            </ul>
                        </div>
                    ))
                }
            </div>
        </main>
    )
}

export default ReportesPublicaciones;