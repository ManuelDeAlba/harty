import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const numSlides = [0, 1, 2];

const Inicio = () => {
    const bg = {
        backgroundImage: 'url("/assets/img/hero-bg.jpg"), linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
      };
      
      const bg2 = {
        backgroundImage: 'url("/assets/img/hero-bg-2.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
      };
      
      const bg3 = {
        backgroundImage: 'url("/assets/img/hero-bg-3.png"), linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))',
      };      
  return (
    <div className="slide-container">
      <Slide images={numSlides} autoPlay={true} autoPlayInterval={1000}>
        <div>
        <header className="header" style={bg}>
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
          </header>
        </div>
        <div>
        <header className="header" style={bg2}>
            <div className="header__contenedor2 contenedor">
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
          </header>
        </div>
        <div>
        <header className="header" style={bg3}>
            <div className="header__contenedor3 contenedor">
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
          </header>
        </div>
      </Slide>
    </div>
  );
};

export default Inicio;
