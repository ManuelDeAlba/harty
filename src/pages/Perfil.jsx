import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { estadoUsuario, obtenerPublicacionesFavoritas, obtenerPublicacionesUsuario, obtenerUsuario } from "../firebase";
import PrevisualizacionPublicacion from "../components/PrevisualizacionPublicacion";
import Protegido from "../components/Protegido";

function Perfil(){
    const { idUsuario } = useParams();

    const [datosPerfil, setDatosPerfil] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionesFavoritas, setPublicacionesFavoritas] = useState([]);

    const handleDeshabilitar = async (id, habilitado) => {
        await estadoUsuario(id, habilitado);

        // Se vuelven a obtener los datos del perfil
        obtenerUsuario(idUsuario)
        .then(setDatosPerfil);
    }

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

                {/* Solo el administrador puede ver el rol y su estado */}
                <Protegido
                    names={["administracion"]}
                    type="component"
                    cargandoComponent={""}
                    errorComponent={""}
                >
                    <span className="perfil__rol"><b>Rol:</b> { datosPerfil.rol }</span>
                    <span className="perfil__estado"><b>Estado:</b> { datosPerfil.habilitado ? "Habilitado" : "Deshabilitado" }</span>
                </Protegido>

                <div className="perfil__botones">
                    <Link className="perfil__boton boton" to={`/editar-perfil/${datosPerfil.id}`}>Editar perfil</Link>
                    <Protegido
                        names={["administracion"]}
                        type="component"
                        cargandoComponent={""}
                        errorComponent={""}
                    >
                        <button className="perfil__boton boton" onClick={() => handleDeshabilitar(datosPerfil.id, !datosPerfil.habilitado)}>{datosPerfil.habilitado ? "Deshabilitar" : "Habilitar"}</button>
                    </Protegido>
                </div>
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