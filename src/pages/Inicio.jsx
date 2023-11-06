import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const numSlides = [0, 1, 2];

const Inicio = () => {
    const bg = {
        backgroundImage: 'url("/assets/img/hero-bg.jpg")',
    };

    const bg2 = {
        backgroundImage: 'url("/assets/img/hero-bg-2.png")',
    };

    const bg3 = {
        backgroundImage: 'url("/assets/img/hero-bg-3.png")',
    };
    return (
        <header className="header">
            <Slide className="header__slider" images={numSlides} autoPlay={true} autoPlayInterval={1000}>
                <div className="header__slide" style={bg}>
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
                <div className="header__slide" style={bg2}>
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
                <div className="header__slide" style={bg3}>
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
