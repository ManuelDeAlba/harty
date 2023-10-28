import { useEffect, useState } from "react";
import { obtenerMultimedia, obtenerPublicacionesTiempoReal } from "../firebase";

function Publicaciones(){
    const [publicaciones, setPublicaciones] = useState(null);
    const [multimedia, setMultimedia] = useState([]);

    useEffect(() => {
        const unsubscribe = obtenerPublicacionesTiempoReal(async publicaciones => {
            // Cada que cambien los datos, se actualiza la página
            // Se guardan los datos de cada publicacion
            setPublicaciones(publicaciones);

            // Se obtienen las url de las imagenes
            for(let i = 0; i < publicaciones.length; i++){
                let mult = await obtenerMultimedia(publicaciones[i].nombreTerraza);

                // Por cada terraza que carga, se actualizan las imagenes para renderizar más rápido
                setMultimedia(prevMultimedia => ({
                    ...prevMultimedia,
                    [publicaciones[i].id]: mult
                }));
            }
        });

        return unsubscribe;
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
                        <p><b>Multimedia:</b>
                            {
                                multimedia[publicacion.id]?.length > 0 ? (
                                    multimedia[publicacion.id].map((imagen, indice) => (
                                        <img width="100" src={imagen} key={indice} />
                                    ))    
                                ) : (
                                    " No hay multimedia para mostrar"
                                )
                            }
                        </p>
                        {/* <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p> */}
                    </div>
                ))
            }
        </main>
    )
}

export default Publicaciones;