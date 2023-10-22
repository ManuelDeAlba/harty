import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function Navbar(){
    const { usuario, usuarioAuth, cerrarSesion } = useAuth();

    return(
        <nav>
            <div className="top-header-area" id="sticker">
                <div className="container">
                    <div className="row">
                    <div className="col-lg-12 col-sm-12 text-center">
                        <div className="main-menu-wrap">
                        <div className="site-logo">
                            <NavLink to="/">
                            <img src="assets/img/logo.png" alt="" style={{ width: 'auto', height: '50px' }}/>
                            </NavLink>
                        </div>

                        <nav className="main-menu">
                            <ul>
                            <li>
                                <NavLink to="/">
                                Inicio
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/publicaciones">
                                Publicaciones
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/publicar-terraza">
                                Publicar terraza
                                </NavLink>
                            </li>

                            <li>
                                {/* Links de sesión */}
                                {usuario && (
                                    <span style={{ color: '#FFDE59' }}>
                                        {usuario.nombre}
                                        {usuarioAuth && usuarioAuth.emailVerified ? " - Verificado" : " - No verificado"}
                                    </span>
                                )}
                            </li>

                            <li>
                                {usuario ? (
                                <NavLink to="/" onClick={cerrarSesion}>
                                    Cerrar sesión
                                </NavLink>
                                ) : (
                                <>
                                    <NavLink to="/registrarse">Registrarse</NavLink>
                                    <NavLink to="/iniciar-sesion">Iniciar sesión</NavLink>
                                </>
                                )}
                            </li>
                            </ul>
                        </nav>
                        <a className="mobile-show search-bar-icon" href="#">
                            <i className="fas fa-search"></i>
                        </a>
                        <div className="mobile-menu"></div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <div className="search-area">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <span className="close-btn"><i className="fas fa-window-close"></i></span>
                            <div className="search-bar">
                                <div className="search-bar-tablecell">
                                    <h3>Search For:</h3>
                                    <input type="text" placeholder="Keywords"/>
                                    <button type="submit">Search <i className="fas fa-search"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;