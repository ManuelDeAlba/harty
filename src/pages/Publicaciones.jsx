import { useEffect, useState } from "react";
import { FaSearch } from 'react-icons/fa';

import { obtenerPublicacionesTiempoReal } from "../firebase";
import PrevisualizacionPublicacion from "../components/PrevisualizacionPublicacion";

function Publicaciones(){   
    const [publicaciones, setPublicaciones] = useState(null);
    const fondo = ["/assets/img/publicaciones-bg.png"];

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
            <header className="header__publicaciones" style={{ backgroundImage: `url(${fondo[0]})` }}>
                <div className="header__contenedor header__contenedor--2 contenedor">
                    <h1 className="header__titulo">Publicaciones</h1>
                    <div className="header__searchbar">
                        <input type="text" placeholder="Buscar..." />
                        <button>
                            <FaSearch />
                        </button>
                    </div>
                </div>
            </header>
            <section className="publicaciones" >
            {
                publicaciones && publicaciones.map(publicacion => (
                    <PrevisualizacionPublicacion publicacion={publicacion} key={publicacion.id} />
                ))
            }
            </section>
        </main>
    )
}

export default Publicaciones;