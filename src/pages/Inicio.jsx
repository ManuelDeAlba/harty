import React from 'react';

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
                        <p className="header__texto">Fresh & Organic</p>
                        <h1 className="header__titulo">Delicious Seasonal Fruits</h1>
                        <div className="header__botones">
                            <a href="shop.html" className="header__cta boton">
                                Fruit Collection
                            </a>
                            <a href="contact.html" className="header__cta header__cta--borde boton">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className="header__slide" style={{ backgroundImage: `url(${fondos[1]})` }}>
                    <div className="header__contenedor header__contenedor--2 contenedor">
                        <p className="header__texto">Fresh & Organic</p>
                        <h1 className="header__titulo">Delicious Seasonal Fruits</h1>
                        <div className="header__botones">
                            <a href="shop.html" className="header__cta boton">
                                Fruit Collection
                            </a>
                            <a href="contact.html" className="header__cta header__cta--borde boton">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide className="header__slide" style={{ backgroundImage: `url(${fondos[2]})` }}>
                    <div className="header__contenedor header__contenedor--3 contenedor">
                        <p className="header__texto">Fresh & Organic</p>
                        <h1 className="header__titulo">Delicious Seasonal Fruits</h1>
                        <div className="header__botones">
                            <a href="shop.html" className="header__cta boton">
                                Fruit Collection
                            </a>
                            <a href="contact.html" className="header__cta header__cta--borde boton">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </header>
    );
};

export default Inicio;
