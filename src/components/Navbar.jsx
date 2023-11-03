import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

import Protegido from './Protegido';

function Navbar() {
    const { usuario, usuarioAuth, cerrarSesion } = useAuth();

    return (
        <nav>
            <div className="top-header-area" id="sticker">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 text-center">
                            <div className="main-menu-wrap">
                                <div className="site-logo">
                                    <NavLink to="/">
                                        <img src="assets/img/logo.png" alt="" />
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

                                        {/* Links de sesión */}
                                        {usuario && usuario.nombre}
                                        {usuario && (usuarioAuth && usuarioAuth.emailVerified ? "Verificado" : "No verificado")}
                                        <li>
                                            {
                                                usuario ? (
                                                    <>
                                                        {/* Muestra este boton solo a los usuarios permitidos (administradores) */}
                                                        <Protegido names={["lista-usuarios"]} type="component" errorComponent={""}>
                                                            <NavLink to="/admin/lista-usuarios">
                                                                Lista de usuarios
                                                            </NavLink>
                                                        </Protegido>

                                                        <NavLink to={`/perfil/${usuario.id}`}>
                                                            Perfil
                                                        </NavLink>
                                                        <NavLink to="/" onClick={cerrarSesion}>
                                                            Cerrar sesión
                                                        </NavLink>
                                                    </>
                                                ) : (
                                                    <>
                                                        <NavLink to="/registrarse">Registrarse</NavLink>
                                                        <NavLink to="/iniciar-sesion">Iniciar sesión</NavLink>
                                                    </>
                                                )
                                            }
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
        </nav>
    )
}

export default Navbar;