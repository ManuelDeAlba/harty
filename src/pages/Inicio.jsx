import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const numSlides = [0, 1, 2];
const fondos = ["/assets/img/hero-bg.jpg", "/assets/img/hero-bg-2.png", "/assets/img/hero-bg-3.png"];

const Inicio = () => {
    return (
        <header className="header__inicio header">
            <Slide className="header__slider" images={numSlides} autoPlay={true} autoPlayInterval={1000}>
                <div className="header__slide" style={{ backgroundImage: `url(${fondos[0]})` }}>
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
                </div>
                <div className="header__slide" style={{ backgroundImage: `url(${fondos[1]})` }}>
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
                </div>
                <div className="header__slide" style={{ backgroundImage: `url(${fondos[2]})` }}>
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
                </div>
            </Slide>
        </header>
    );
};

export default Inicio;
