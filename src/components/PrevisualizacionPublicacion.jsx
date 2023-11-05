import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";
import { obtenerMultimedia } from "../firebase";

function PrevisualizacionPublicacion({ publicacion }){
    const { usuario } = useAuth();
    
    const [multimedia, setMultimedia] = useState([]);

    useEffect(() => {
        obtenerMultimedia(publicacion.id)
        .then(setMultimedia);
    }, [])

    return(
        <div>
            <h2>{publicacion.nombreTerraza}</h2>
            {
                // Solo muestra el boton para editar si es admin o el dueño de la publicación
                usuario && (publicacion.idUsuario == usuario.id || usuario.rol == "admin") && (
                    <Link to={`/editar-terraza/${publicacion.id}`}>Editar</Link>
                )
            }
            <p><b>Descripción:</b> {publicacion.descripcion}</p>
            <p><b>Reglamento:</b> {publicacion.reglamento}</p>
            <p><b>Dirección:</b> {publicacion.direccion}</p>
            <p><b>Teléfono:</b> {publicacion.telefono}</p>
            <p><b>Redes sociales:</b> {publicacion.redes}</p>
            <p><b>Precio:</b> {publicacion.precio}</p>
            <p><b>Horarios:</b> {publicacion.horarios}</p>
            <p><b>Tamaño:</b> {publicacion.tamano}</p>
            <p><b>Capacidad de personas:</b> {publicacion.capacidad}</p>
            <p><b>Servicios extras:</b> {publicacion.servicios}</p>
            <p><b>Etiquetas:</b> {publicacion.etiquetas.map((etiqueta, indice) => <span key={indice}>{ etiqueta }</span>)}</p>
            <p><b>Multimedia:</b>
                {
                    multimedia.length > 0 ? (
                        multimedia.map((imagen, indice) => (
                            <img width="100" src={imagen.src} key={indice} />
                        ))    
                    ) : (
                        " No hay multimedia para mostrar"
                    )
                }
            </p>
            {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
        </div>
    )
}

export default PrevisualizacionPublicacion;