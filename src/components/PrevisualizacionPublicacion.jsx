import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { obtenerPrevisualizacion } from "../firebase";

function PrevisualizacionPublicacion({ publicacion }){
    const { usuario } = useAuth();
    
    const [previsualizacion, setPrevisualizacion] = useState(null);

    useEffect(() => {
        obtenerPrevisualizacion(publicacion.id)
        .then(setPrevisualizacion);
    }, [])

    return(
        // Estilos temporales
        <div style={{background: "#ccc", margin: "1rem", padding: "1rem 2rem", borderRadius: "3px"}}>
            {
                // Solo muestra el boton para editar si es admin o el dueño de la publicación
                usuario && (publicacion.idUsuario == usuario.id || usuario.rol == "admin") && (
                    <Link to={`/editar-terraza/${publicacion.id}`}>Editar</Link>
                )
            }
            <Link to={`/publicacion/${publicacion.id}`}>
                {
                    previsualizacion && (
                        <img width="100" src={previsualizacion} />  
                    )
                }
                <h2>{publicacion.nombreTerraza}</h2>
            </Link>
            <p><b>Precio:</b> {publicacion.precio}</p>
            <p><b>Calificación:</b> FALTA</p>
            {/* Dirección temporal */}
            <p><b>Dirección:</b> {JSON.stringify(publicacion.direccion)}</p>
            <p><b>Horarios:</b> {publicacion.horarios}</p>
            <p><b>Tamaño:</b> {publicacion.tamano}</p>
            <p><b>Capacidad de personas:</b> {publicacion.capacidad}</p>
            {
                publicacion.etiquetas.length > 0 && (
                    publicacion.etiquetas.map((etiqueta, indice) => <span key={indice}>&#35;{ etiqueta } </span>)
                )
            }
            {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
        </div>
    )
}

export default PrevisualizacionPublicacion;