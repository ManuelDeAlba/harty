import { useEffect, useState } from "react";

import { obtenerPublicacionesTiempoReal } from "../firebase";

import FiltroPublicaciones from "../components/FiltroPublicaciones";
import PrevisualizacionPublicacion from "../components/PrevisualizacionPublicacion";

function Publicaciones(){   
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);
    const [cargando, setCargando] = useState(true);

    const fondo = ["/assets/img/publicaciones-bg.png"];

    useEffect(() => {
        const unsubscribe = obtenerPublicacionesTiempoReal(async publicaciones => {
            // Cada que cambien los datos, se actualiza la página
            // Se guardan los datos de cada publicacion
            setPublicaciones(publicaciones);
            setCargando(false);
        });

        return unsubscribe;
    }, [])

    if(cargando) return <span className="contenedor">Cargando...</span>

    return(
        <main>
            <header className="header__publicaciones" style={{ backgroundImage: `url(${fondo[0]})` }}>
                <div className="header__contenedor header__contenedor--2 contenedor">
                    <h1 className="header__titulo">Publicaciones</h1>
                    <FiltroPublicaciones publicaciones={publicaciones} onInput={setPublicacionesFiltradas} />
                </div>
            </header>
            {
                publicacionesFiltradas.length > 0 ? (
                    <section className="publicaciones">
                        {
                            publicacionesFiltradas.map(publicacion => (
                                <PrevisualizacionPublicacion publicacion={publicacion} key={publicacion.id} />
                            ))
                        }
                    </section>
                ) : (
                    <span className="contenedor">No hay publicaciones o no hay coincidencias con el filtro</span>
                )
            }
        </main>
    )
}

export default Publicaciones;