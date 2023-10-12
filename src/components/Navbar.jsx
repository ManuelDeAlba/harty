import { NavLink } from 'react-router-dom';

function Navbar(){
    return(
        <nav>
            <NavLink to="/">Inicio</NavLink>
            <NavLink to="/publicaciones">Publicaciones</NavLink>
            <NavLink to="/publicar-terraza">Publicar terraza</NavLink>
        </nav>
    )
}

export default Navbar;