import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

import { obtenerPublicacionesRecomendadasCertificadas, obtenerPublicacionesRecomendadasFavoritas } from '../firebase';

import PrevisualizacionPublicacion from '../components/PrevisualizacionPublicacion';

const fondos = ["/assets/img/hero-bg.jpg", "/assets/img/hero-bg-2.png", "/assets/img/hero-bg-3.png"];

const Inicio = () => {
    const [recomendadasCertificadas, setRecomendadasCertificadas] = useState(null);
    const [recomendadasFavoritas, setRecomendadasFavoritas] = useState(null);

    useEffect(() => {
        obtenerPublicacionesRecomendadasCertificadas()
        .then(setRecomendadasCertificadas)

        obtenerPublicacionesRecomendadasFavoritas()
        .then(setRecomendadasFavoritas)
    }, [])

    return (
        <>
            <header className="header__inicio header">
                <Swiper
                    className='header__slider'
                    modules={[Autoplay]}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    speed={1000}
                    loop
                >
                    <SwiperSlide className="header__slide" style={{ backgroundImage: `url(${fondos[0]})` }}>
                        <div className="header__contenedor contenedor">
                            <p className="header__texto">Fiestas Inolvidables</p>
                            <h1 className="header__titulo">Encuentra tu lugar perfecto</h1>
                            <div className="header__botones">
                                <Link className='header__cta boton' to="/publicaciones">Explora Lugares</Link>
                                <Link className='header__cta header__cta--borde boton' to="/publicar-terraza">Publica tu Espacio</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="header__slide" style={{ backgroundImage: `url(${fondos[1]})` }}>
                        <div className="header__contenedor header__contenedor--2 contenedor">
                            <p className="header__texto">Terrazas Exclusivas</p>
                            <h1 className="header__titulo">Las mejores terrazas con alberca para tu Fiesta</h1>
                            <div className="header__botones">
                            <Link className='header__cta boton' to="/publicaciones"> Descubre Albercas</Link>
                            <Link className='header__cta header__cta--borde boton' to="/publicar-terraza">Publica tu Terraza</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide className="header__slide" style={{ backgroundImage: `url(${fondos[2]})` }}>
                        <div className="header__contenedor header__contenedor--3 contenedor">
                            <p className="header__texto">Celebra con Amigos</p>
                            <h1 className="header__titulo">Espacios íntimos para eventos </h1>
                            <div className="header__botones">
                                <Link className='header__cta boton' to="/publicaciones">Explora Terrazas</Link>
                                <Link className='header__cta header__cta--borde boton' to="/publicar-terraza">Publica tu Lugar</Link>
                            </div>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </header>
            <main>
                <h2 className='recomendadas__titulo titulo'>Publicaciones recomendadas</h2>
                
                <section className='recomendadas recomendadas--certificadas'>
                    <h3 className='titulo'>Certificadas</h3>

                    <div className='recomendadas__publicaciones contenedor'>
                        {
                            recomendadasCertificadas && recomendadasCertificadas.map(recomendada => (
                                <PrevisualizacionPublicacion publicacion={recomendada} key={recomendada.id} />
                            ))
                        }
                    </div>
                </section>

                <section className='recomendadas recomendadas--favoritas'>
                    <h3 className='titulo'>Favoritas</h3>

                    <div className="recomendadas__publicaciones contenedor">
                        {
                            recomendadasFavoritas && recomendadasFavoritas.map(recomendada => (
                                <PrevisualizacionPublicacion publicacion={recomendada} key={recomendada.id} />
                            ))
                        }
                    </div>
                </section>
            </main>
        </>
    );
};

export default Inicio;
