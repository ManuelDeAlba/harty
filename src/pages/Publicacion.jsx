import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerMultimedia, obtenerPublicacion } from "../firebase";

function Publicacion(){
    const { idPublicacion } = useParams();

    const [cargando, setCargando] = useState(true);
    const [publicacion, setPublicacion] = useState(null);
    const [multimedia, setMultimedia] = useState([]);

    useEffect(() => {
        const obtenerDatos = async () => {
            setCargando(true);

            // Se obtienen los datos en paralelo
            let [publicacion, multimedia] = await Promise.all([
                obtenerPublicacion(idPublicacion),
                obtenerMultimedia(idPublicacion)
            ])

            setPublicacion(publicacion);
            setMultimedia(multimedia);

            setCargando(false);
        }

        obtenerDatos();
    }, [idPublicacion])

    if(cargando) return <h3>Cargando...</h3>

    if(!publicacion) return <h3>No existe la publicación</h3>

    return(
        <main>
            <section>
                <h1>{publicacion.nombreTerraza}</h1>
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
            </section>

            <section>
                <span><b>Acciones (reportar), calificar, etc.</b></span>
                <span>Reportar terraza</span>
                <div>
                    <span>Calificar</span>
                    <span onClick={() => alert(1)}>⭐</span>
                    <span onClick={() => alert(2)}>⭐</span>
                    <span onClick={() => alert(3)}>⭐</span>
                    <span onClick={() => alert(4)}>⭐</span>
                    <span onClick={() => alert(5)}>⭐</span>
                </div>
            </section>

            <section>
                <span><b>Comentarios</b></span>
                <ul>
                    <li>Lista</li>
                    <li>de</li>
                    <li>Comentarios</li>
                </ul>
            </section>
        </main>
    )
}

export default Publicacion;