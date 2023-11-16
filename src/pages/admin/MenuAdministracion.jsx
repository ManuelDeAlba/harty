import { Link } from "react-router-dom";

function MenuAdministracion(){
    return(
        <main className="contenedor">
            <h1>Menu Administracion</h1>

            <div className="administracion__links">
                <Link className="administracion__link boton" to="/admin/lista-usuarios">Lista de Usuarios</Link>
                <Link className="administracion__link boton" to="/admin/lista-certificaciones">Solicitudes de Certificaciones</Link>
                <Link className="administracion__link boton" to="/admin/lista-reportes">Reportes de Terrazas</Link>
            </div>
        </main>
    )
}

export default MenuAdministracion;