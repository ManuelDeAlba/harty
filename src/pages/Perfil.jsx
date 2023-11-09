import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { obtenerPublicacionesUsuario, obtenerUsuario } from "../firebase";
import PrevisualizacionPublicacion from "../components/PrevisualizacionPublicacion";

function Perfil(){
    const { idUsuario } = useParams();

    const [datosPerfil, setDatosPerfil] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);

    // Al cambiar la url (id del usuario) se vuelve a obtener todo
    useEffect(() => {
        obtenerUsuario(idUsuario)
        .then(setDatosPerfil);

        obtenerPublicacionesUsuario(idUsuario)
        .then(setPublicaciones);
    }, [idUsuario])

    if(!datosPerfil) return <h3>Cargando...</h3>

    return(
        <main>
            <section>
                <h1>{ datosPerfil.nombre }</h1>
                <p><span>Nombre:</span> { datosPerfil.nombre }</p>
                <p><span>Correo:</span> { datosPerfil.correo }</p>
                <p><span>Rol:</span> { datosPerfil.rol }</p>
                <Link to={`/editar-perfil/${datosPerfil.id}`}>Editar perfil</Link>
            </section>
            <section>
                {
                    publicaciones.length > 0 ? (
                        <>
                            <h2>Publicaciones</h2>

                            {
                                publicaciones.map(publicacion => (
                                    <PrevisualizacionPublicacion publicacion={publicacion} key={publicacion.id} />
                                ))
                            }
                        </>
                    ) : (
                        <h2>No hay publicaciones para mostrar</h2>
                    )
                }
            </section>
        </main>
    )
}

export default Perfil;