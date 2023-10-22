import { useEffect, useState } from "react";
import { obtenerPublicacionesTiempoReal } from "../firebase";
import LoadScripts from '../components/LoadScripts';

function Publicaciones(){
    const [publicaciones, setPublicaciones] = useState(null);

    useEffect(() => {
        const unsubscribe = obtenerPublicacionesTiempoReal(publicaciones => {
            // Cada que cambien los datos, se actualiza la página
            setPublicaciones(publicaciones);
        });

        return unsubscribe;
    }, [])

    return(
        <main>
            {LoadScripts()}

            {/* portada publicaciones */}
            <div className="breadcrumb-section breadcrumb-bg">
                <div className="container">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2 text-center">
                    <div className="breadcrumb-text">
                        <p>HARTY</p>
                        <h1>Publicaciones</h1>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            {/* fin portada*/}

            {/* publicaciones */}
            <div className="latest-news mt-150 mb-150">
                <div className="container">
                    <div className="row">
                    {publicaciones && publicaciones.map(publicacion => (
                        <div key={publicacion.id} className="col-lg-4 col-md-6">
                            <div className="single-latest-news">
                                <a href="#">
                                    {/* Imagen: link a la publicación */}
                                    <div className="latest-news-bg news-bg-2" style={{ backgroundImage: `url(../assets/img/latest-news/news-bg-2.jpg)` }} />
                                </a>
                                <div className="news-text-box">
                                    <h3>
                                        <a href="#">{publicacion.nombreTerraza}</a>
                                    </h3>
                                    <p className="blog-meta">
                                        <span className="author">
                                            <i className="fas fa-user" />Admin {/* usuario */}
                                        </span>
                                        <span className="date">
                                            <i className="fas fa-calendar" /> 27 December, 2019 {/* fecha de publicación */}
                                        </span>
                                    </p>
                                    <p className="excerpt">{publicacion.descripcion}</p>
                                    <a href="#" className="read-more-btn">
                                        leer más <i className="fas fa-angle-right" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
            {/* publicaciones */}

            {/*
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
                        <p><b>Multimedia:</b> {publicacion.multimedia}</p>
                        <p><b>Disponibilidad:</b> {publicacion.disponibilidad}</p>
                    </div>
                ))
            */}
        </main>
    )
}

export default Publicaciones;