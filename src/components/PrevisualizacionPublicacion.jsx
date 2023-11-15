import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaClock, FaUsers } from 'react-icons/fa';
import { RiVerifiedBadgeFill } from "react-icons/ri";

import { useAuth } from "../context/AuthProvider";

import { obtenerCalificacion, obtenerPrevisualizacion } from "../firebase";
import { truncarCalificacion } from "../utils";

function PrevisualizacionPublicacion({ publicacion }){
    const { usuario } = useAuth();
    
    const [previsualizacion, setPrevisualizacion] = useState(null);
    const [calificacion, setCalificacion] = useState(0);

    useEffect(() => {
        obtenerPrevisualizacion(publicacion.id)
        .then(setPrevisualizacion);

        obtenerCalificacion({ idPublicacion: publicacion.id })
        .then(({ calificacionTotal }) => {
            setCalificacion(calificacionTotal);
        })
    }, [])

    return(
        // Estilos temporales
        <div className="previsualizacion">
            {
                // Solo muestra el boton para editar si es admin o el dueño de la publicación
                usuario && (publicacion.idUsuario == usuario.id || usuario.rol == "admin") && (
                    <Link to={`/editar-terraza/${publicacion.id}`} className="previsualizacion__editar">Editar</Link>
                )
            }
            {
                // Insignia de verificación
                publicacion.certificada && (
                    <RiVerifiedBadgeFill className="previsualizacion__certificada" />
                )
            }
            <Link className="previsualizacion__portada" to={`/publicacion/${publicacion.id}`}>
                {
                    previsualizacion && (
                        <img className="previsualizacion__img" src={previsualizacion} />
                    )
                }
            </Link>
            <div className="previsualizacion__texto">
                <Link to={`/publicacion/${publicacion.id}`}>
                    <h5 className="texto-overflow">{publicacion.nombreTerraza}</h5>
                </Link>
                <div className="row">
                    <div className="column texto-overflow">
                        <FaClock style={{ fontSize: '.85em', marginRight: '0.5em' }}/>
                        <p className="column-font">{publicacion.horarios}</p>
                    </div>
                    {/*<div className="column texto-overflow">
                        <FaRuler style={{ fontSize: '1.5em', marginRight: '0.5em' }}/>
                        <p>{publicacion.tamano}</p>
                    </div>
                    */}
                    <div className="column texto-overflow">
                        <FaUsers style={{ fontSize: '.85em', marginRight: '0.5em' }}/>
                        <p className="column-font">{publicacion.capacidad}</p>
                    </div>
                </div>
                <span className="previsualizacion__precio"><b>$</b> {publicacion.precio}</span>
                <p className="previsualizacion__calificacion"><span className="previsualizacion__estrella">★</span> {truncarCalificacion(calificacion) || "Sin calificaciones"}</p>
                {/* Dirección temporal */}
                <div className="previsualizacion__etiquetas">
                    {
                        publicacion.etiquetas.length > 0 && (
                            publicacion.etiquetas.map((etiqueta, indice) => <span className="previsualizacion__etiqueta" key={indice}>&#35;{ etiqueta } </span>)
                        )
                    }
                </div>
            </div>
            {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
        </div>
    )
}

export default PrevisualizacionPublicacion;

