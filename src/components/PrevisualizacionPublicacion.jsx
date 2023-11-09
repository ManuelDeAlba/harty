import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { obtenerPrevisualizacion } from "../firebase";

import { FaClock, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

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
                    <Link to={`/editar-terraza/${publicacion.id}`} className="publicacion__editar">Editar</Link>
                )
            }
            <Link className="publicacion__portada" to={`/publicacion/${publicacion.id}`}>
                {
                    previsualizacion && (
                        <img className="publicacion__img" src={previsualizacion} />
                    )
                }
            </Link>
            <div className="publicacion__texto">
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
                <h4><b>$</b> {publicacion.precio}</h4>
                <p className="publicacion__calificacion">4.5 ★★★★★</p>
                {/* Dirección temporal */}
                <div className="publicacion__direccion">
                    <FaMapMarkerAlt style={{ fontSize: '2em', marginRight: '0.5em', marginBottom:'2px' }} /> 
                    <span className="texto-overflow">{JSON.stringify(publicacion.direccion)}</span>                
                </div>
                <div className="publicacion__etiquetas">
                    {
                        publicacion.etiquetas.length > 0 && (
                            publicacion.etiquetas.map((etiqueta, indice) => <span className="publicacion__etiqueta" key={indice}>&#35;{ etiqueta } </span>)
                        )
                    }
                </div>
            </div>
            {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
        </div>
    )
}

export default PrevisualizacionPublicacion;

