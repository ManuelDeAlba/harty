import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useTitle from "../../hooks/useTitle";

import { obtenerReportes } from "../../firebase";

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

    useTitle("Harty | Reportes de publicaciones");

    if(cargando) return <span className="contenedor">Cargando...</span>

    if(!reportes) return <span className="contenedor">No hay reportes</span>

    return(
        <main className="contenedor">
            <h1 className="titulo">Reportes de publicaciones</h1>

            <div className="reportes">
                {
                    reportes.map(({ publicacion, reportes, usuarios }) => (
                        <div className="reporte" key={publicacion.id}>
                            <Link className="reporte__nombre boton" to={`/publicacion/${publicacion.id}`}>{publicacion.nombreTerraza}</Link>
                            <b>{reportes.length} {reportes.length == 1 ? "reporte" : "reportes"}</b>
                            <ul className="reporte__usuarios">
                                {
                                    usuarios.map((usuario, indice) => (
                                        <li key={indice}><Link className="reporte__link" to={`/perfil/${usuario.id}`}>{usuario.nombre}</Link></li>
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