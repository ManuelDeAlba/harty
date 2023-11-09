import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { obtenerPrevisualizacion } from "../firebase";

import { FaClock, FaRuler, FaUsers, FaMapMarker, FaMapMarkerAlt } from 'react-icons/fa';

function PrevisualizacionPublicacion({ publicacion }){
    const { usuario } = useAuth();
    
    const [previsualizacion, setPrevisualizacion] = useState(null);

    useEffect(() => {
        obtenerPrevisualizacion(publicacion.id)
        .then(setPrevisualizacion);
    }, [])

    return(
        // Estilos temporales
        <div className="publicacion">
            {
                // Solo muestra el boton para editar si es admin o el dueño de la publicación
                usuario && (publicacion.idUsuario == usuario.id || usuario.rol == "admin") && (
                    <Link to={`/editar-terraza/${publicacion.id}`} className="editar_publicacion">Editar</Link>
                )
            }
            <Link to={`/publicacion/${publicacion.id}`}>
                {
                    previsualizacion && (
                        <img  className="img_publicacion" src={previsualizacion} />  
                    )
                }
            </Link>
            <div className = "texto_publicacion">
                <Link to={`/publicacion/${publicacion.id}`}>
                        <h5 className="texto_overflow">{publicacion.nombreTerraza}</h5>
                </Link>
                <div className="row">
                    <div className="column texto_overflow">
                        <FaClock style={{ fontSize: '.85em', marginRight: '0.5em' }}/>
                        <p className="column_font">{publicacion.horarios}</p>
                    </div>
                    {/*<div className="column texto_overflow">
                        <FaRuler style={{ fontSize: '1.5em', marginRight: '0.5em' }}/>
                        <p>{publicacion.tamano}</p>
                    </div>
                    */}
                    <div className="column texto_overflow">
                        <FaUsers style={{ fontSize: '.85em', marginRight: '0.5em' }}/>
                        <p className="column_font">{publicacion.capacidad}</p>
                    </div>
                </div>
                <h4><b>$</b> {publicacion.precio}</h4>
                <p className="calificacion"> 4.5 ★★★★★</p>
                {/* Dirección temporal */}
                <div className="direccion">
                    <FaMapMarkerAlt style={{ fontSize: '2em', marginRight: '0.5em', marginBottom:'2px' }} /> {/* Ajusta el tamaño y el margen según tus preferencias */}
                    <span className="texto_overflow">{JSON.stringify(publicacion.direccion)}</span>                
                </div>
                <div className="etiquetas-container">
                    {
                        publicacion.etiquetas.length > 0 && (
                            publicacion.etiquetas.map((etiqueta, indice) => <span className="etiqueta texto_overflow" key={indice}>&#35;{ etiqueta } </span>)
                        )
                    }
                </div>
            </div>
            {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
        </div>
    )
}

export default PrevisualizacionPublicacion;

