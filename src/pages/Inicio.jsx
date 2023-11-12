import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { Link } from "react-router-dom";

const numSlides = [0, 1, 2];
const fondos = ["/assets/img/hero-bg.jpg", "/assets/img/hero-bg-2.png", "/assets/img/hero-bg-3.png"];

const Inicio = () => {
    return (
        <header className="header__inicio header">
            <Slide className="header__slider" images={numSlides} autoPlay={true} autoPlayInterval={1000}>
                <div className="header__slide" style={{ backgroundImage: `url(${fondos[0]})` }}>
                    <div className="header__contenedor contenedor">
                        <p className="header__texto">Fiestas Inolvidables</p>
                         <h1 className="header__titulo">Encuentra tu lugar perfecto</h1>
                        <div className="header__botones">
                            <Link className='header__cta boton' to="/publicaciones">Explora Lugares</Link>
                            <Link className='header__cta header__cta--borde boton' to="/publicar-terraza">Publica tu Espacio</Link>
                        </div>
                    </div>
                </div>
                <div className="header__slide" style={{ backgroundImage: `url(${fondos[1]})` }}>
                    <div className="header__contenedor header__contenedor--2 contenedor">
                        <p className="header__texto">Terrazas Exclusivas</p>
                        <h1 className="header__titulo">Las mejores terrazas con alberca para tu Fiesta</h1>
                        <div className="header__botones">
                           <Link className='header__cta boton' to="/publicaciones"> Descubre Albercas</Link>
                           <Link className='header__cta header__cta--borde boton' to="/publicar-terraza">Publica tu Terraza</Link>
                        </div>
                    </div>
                </div>
                <div className="header__slide" style={{ backgroundImage: `url(${fondos[2]})` }}>
                    <div className="header__contenedor header__contenedor--3 contenedor">
                        <p className="header__texto">Celebra con Amigos</p>
                        <h1 className="header__titulo">Espacios íntimos para eventos </h1>
                        <div className="header__botones">
                            <Link className='header__cta boton' to="/publicaciones">Explora Terrazas</Link>
                            <Link className='header__cta header__cta--borde boton' to="/publicar-terraza">Publica tu Lugar</Link>
                        </div>
                    </div>
                </div>
            </Slide>
        </header>
    );
};

export default Inicio;
