import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthProvider";

import { obtenerPublicacionesFavoritas, obtenerPublicacionesUsuario, obtenerUsuario } from "../firebase";
import PrevisualizacionPublicacion from "../components/PrevisualizacionPublicacion";

function Perfil(){
    const { idUsuario } = useParams();
    const { usuario } = useAuth();

    const [datosPerfil, setDatosPerfil] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionesFavoritas, setPublicacionesFavoritas] = useState([]);

    // Al cambiar la url (id del usuario) se vuelve a obtener todo
    useEffect(() => {
        obtenerUsuario(idUsuario)
        .then(setDatosPerfil);

        obtenerPublicacionesUsuario(idUsuario)
        .then(setPublicaciones);

        obtenerPublicacionesFavoritas(idUsuario)
        .then(setPublicacionesFavoritas);
    }, [idUsuario])

    if(!datosPerfil) return <span className="contenedor">Cargando...</span>

    return(
        <main>
            <section className="perfil__datos contenedor">
                <h1 className="perfil__nombre">{ datosPerfil.nombre }</h1>
                <span className="perfil__correo"><b>Correo:</b> { datosPerfil.correo }</span>
                {
                    usuario && usuario.rol == "admin" && (
                        <span className="perfil__rol"><b>Rol:</b> { datosPerfil.rol }</span>
                    )
                }
                <Link className="perfil__editar boton" to={`/editar-perfil/${datosPerfil.id}`}>Editar perfil</Link>
            </section>

            <section className="contenedor-publicaciones">
                <h2 className="publicaciones__titulo">Publicaciones</h2>
                {
                    publicaciones && publicaciones.length > 0 ? ( //para verificar que el perfil tenga publicaciones
                        <div className="publicaciones publicaciones--perfil">
                            {
                                publicaciones.map(publicacion => (
                                    <PrevisualizacionPublicacion publicacion={publicacion} key={publicacion.id} />
                                ))
                            }
                        </div>
                    ) : (
                        <span className="publicaciones__error">No hay publicaciones para mostrar</span>
                    )
                }
            </section>

            <section className="contenedor-publicaciones">
                <h2 className="publicaciones__titulo">Publicaciones favoritas</h2>
                {
                    publicacionesFavoritas && publicacionesFavoritas.length > 0 ? (
                        <div className="publicaciones publicaciones--perfil">
                            {
                                publicacionesFavoritas.map(publicacion => (
                                    <PrevisualizacionPublicacion publicacion={publicacion} key={publicacion.id} />
                                ))
                            }
                        </div>
                    ) : (
                        <span className="publicaciones__error">No hay publicaciones favoritas para mostrar</span>
                    )
                }
            </section>
        </main>
    )
}

export default Perfil;