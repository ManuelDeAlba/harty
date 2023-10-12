import { useEffect, useState } from "react";
import { obtenerPublicaciones } from "../../firebase";

function Publicaciones(){
    const [publicaciones, setPublicaciones] = useState(null);

    //! Cambiar para obtener los cambios en tiempo real y no solo al cargar la página
    useEffect(() => {
        const obtenerPublicacionesDB = async () => {
            let publicacionesDB = await obtenerPublicaciones();

            setPublicaciones(publicacionesDB);
        }
        obtenerPublicacionesDB();
    }, [])

    return(
        <main>
            <h1>Publicaciones</h1>
            {
                publicaciones && publicaciones.map(publicacion => (
                    <div key={publicacion.id}>
                        <h2>{publicacion.nombreTerraza}</h2>
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
                        <p><b>Etiquetas:</b> {publicacion.etiquetas}</p>
                        {/* <p><b>Multimedia:</b> {publicacion.multimedia}</p> */}
                        {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
                    </div>
                ))
            }
        </main>
    )
}

export default Publicaciones;