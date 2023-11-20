import { Link } from "react-router-dom";

import useTitle from "../../hooks/useTitle";

function MenuAdministracion(){
    useTitle("Harty | Administración");

    return(
        <main className="contenedor">
            <h1 className="titulo">Menu Administracion</h1>

            <div className="administracion__links">
                <Link className="administracion__link boton" to="/admin/lista-usuarios">Lista de Usuarios</Link>
                <Link className="administracion__link boton" to="/admin/lista-certificaciones">Solicitudes de Certificaciones</Link>
                <Link className="administracion__link boton" to="/admin/lista-reportes-terrazas">Reportes de Terrazas</Link>
                <Link className="administracion__link boton" to="/admin/lista-reportes-comentarios">Reportes de Comentarios</Link>
            </div>
        </main>
    )
}

export default MenuAdministracion;