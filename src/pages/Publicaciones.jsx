import { useEffect, useState } from "react";

import { obtenerPublicacionesTiempoReal } from "../firebase";
import PrevisualizacionPublicacion from "../components/PrevisualizacionPublicacion";

function Publicaciones(){   
    const [publicaciones, setPublicaciones] = useState(null);

    useEffect(() => {
        const unsubscribe = obtenerPublicacionesTiempoReal(async publicaciones => {
            // Cada que cambien los datos, se actualiza la página
            // Se guardan los datos de cada publicacion
            setPublicaciones(publicaciones);
        });

        return unsubscribe;
    }, [])

    return(
        <main>
            <h1>Publicaciones</h1>
            {
                publicaciones && publicaciones.map(publicacion => (
                    <PrevisualizacionPublicacion publicacion={publicacion} key={publicacion.id} />
                ))
            }
        </main>
    )
}

export default Publicaciones;