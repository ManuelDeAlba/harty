import React from 'react';
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const fondos = ["/assets/img/hero-bg.jpg", "/assets/img/hero-bg-2.png", "/assets/img/hero-bg-3.png"];

const Inicio = () => {
    return (
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
    );
};

export default Inicio;
