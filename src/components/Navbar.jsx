import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import Protegido from './Protegido';

function Navbar() {
    const { usuario, cerrarSesion } = useAuth();
    const [scrolled, setScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 0);
      };

      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    return (
        <nav className={`nav${scrolled ? " nav--scrolled" : ""}`}>
            <div className="nav__contenedor">
                <NavLink className='nav__logo' to="/">
                    <img className='nav__img' src="assets/img/logo.png" alt="Logo de Harty" />
                </NavLink>

                <div className="nav__links">
                    <div className="nav__paginas">
                        <NavLink className='nav__link' to="/">Inicio</NavLink>
                         {/* Componente de prueba del slideshow para inicio, borrar después*/}
                        <NavLink className='nav__link' to="/publicaciones">Publicaciones</NavLink>
                        <NavLink className='nav__link' to="/publicar-terraza">Publicar</NavLink>
                    </div>
                    
                    {/* Links de sesión */}
                    <div className="nav__sesion">
                        {
                            usuario ? (
                                <>
                                    {/* Muestra este boton solo a los usuarios permitidos (administradores) */}
                                    <Protegido names={["lista-usuarios"]} type="component" errorComponent={""}>
                                        <NavLink className='nav__link' to="/admin/lista-usuarios">Usuarios</NavLink>
                                    </Protegido>

                                    <NavLink className='nav__link' to={`/perfil/${usuario.id}`}>Mi perfil</NavLink>
                                    <NavLink className='nav__link' to="/" onClick={cerrarSesion}>Cerrar sesión</NavLink>
                                </>
                            ) : (
                                <>
                                    <NavLink className='nav__link' to="/registrarse">Registrarse</NavLink>
                                    <NavLink className='nav__link' to="/iniciar-sesion">Iniciar sesión</NavLink>
                                </>
                            )
                        }
                    </div>
                </div>

                <label className="nav__hamburguesa" htmlFor="menu">
                    <svg xmlns="http://www.w3.org/2000/svg" className="nav__icono icon icon-tabler icon-tabler-menu-2" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 6l16 0"></path><path d="M4 12l16 0"></path>
                        <path d="M4 18l16 0"></path>
                    </svg>
                </label>
                <input id="menu" type="checkbox" className="nav__checkbox"></input>
            </div>
        </nav>
    )
}

export default Navbar;