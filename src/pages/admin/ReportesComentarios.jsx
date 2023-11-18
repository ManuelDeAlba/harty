import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useModal } from "../../context/ModalConfirmProvider";

import { borrarComentario, cancelarReportesComentario, obtenerReportesComentarios } from "../../firebase";

function ReportesComentarios(){
    const { abrirModal, cerrarModal } = useModal();

    const [cargando, setCargando] = useState(false);
    const [reportes, setReportes] = useState(null);

    const handleBorrarComentario = async (idComentario) => {
        abrirModal({
            texto: "¿Realmente quieres borrar el comentario?",
            onResult: (res) => {
                if(res){
                    toast.promise(borrarComentario(idComentario), {
                        loading: "Borrando comentario...",
                        success: () => {
                            setCargando(true);
                            obtenerReportesComentarios()
                            .then(reportes => {
                                setReportes(reportes);
                                setCargando(false);
                            });

                            return "Comentario borrado";
                        },
                        error: (error) => error.message
                    });
                }

                cerrarModal();
            }
        })
    }

    const handleCancelarReportes = async (idComentario) => {
        abrirModal({
            texto: "¿Realmente quieres cancelar los reportes de este comentario?",
            onResult: (res) => {
                if(res){
                    toast.promise(cancelarReportesComentario(idComentario), {
                        loading: "Cancelando reportes...",
                        success: () => {
                            setCargando(true);
                            obtenerReportesComentarios()
                            .then(reportes => {
                                setReportes(reportes);
                                setCargando(false);
                            });

                            return "Reportes cancelado";
                        },
                        error: (error) => error.message
                    });
                }

                cerrarModal();
            }
        })
    }

    useEffect(() => {
        setCargando(true);
        obtenerReportesComentarios()
        .then(reportes => {
            setReportes(reportes);
            setCargando(false);
        });
    }, [])

    if(cargando) return <span className="contenedor">Cargando...</span>

    if(!reportes) return <span className="contenedor">No hay reportes</span>

    return(
        <main className="contenedor">
            <h1>Reportes de comentarios</h1>

            <div className="reportes">
                {
                    reportes.map(({ comentario, creador, reportes, usuarios }) => (
                        <div className="reporte" key={comentario.id}>
                            <Link to={`/perfil/${creador.id}`}>{creador.nombre}</Link>
                            <span>{comentario.comentario}</span>
                            <b>{reportes.length} {reportes.length == 1 ? "reporte" : "reportes"}</b>
                            <div className="reporte__botones">
                                <button className="reporte__boton boton boton--rojo" onClick={() => handleBorrarComentario(comentario.id)}>Eliminar</button>
                                <button className="reporte__boton boton" onClick={() => handleCancelarReportes(comentario.id)}>Cancelar</button>
                            </div>
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

export default ReportesComentarios;