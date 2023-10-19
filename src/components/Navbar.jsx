import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function Navbar(){
    const { usuario, usuarioAuth, cerrarSesion } = useAuth();

    return(
        <nav>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/publicaciones">Publicaciones</NavLink>
            <NavLink to="/publicar-terraza">Publicar terraza</NavLink>

            {/* Links de sesión */}
            { usuario && usuario.nombre }
            { usuario && (usuarioAuth && usuarioAuth.emailVerified ? "Verificado" : "No verificado") }
            {
                usuario ? (
                    <NavLink to="/" onClick={cerrarSesion}>Cerrar sesión</NavLink>
                ) : (
                    <>
                        <NavLink to="/registrarse">Registrarse</NavLink>
                        <NavLink to="/iniciar-sesion">Iniciar sesión</NavLink>
                    </>
                )
            }
        </nav>
    )
}

export default Navbar;