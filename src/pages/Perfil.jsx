import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { obtenerUsuario } from "../firebase";

function Perfil(){
    const { idUsuario } = useParams();

    const [datosPerfil, setDatosPerfil] = useState(null);

    // Al cambiar la url (id del usuario) se vuelve a obtener todo
    useEffect(() => {
        obtenerUsuario(idUsuario)
        .then(setDatosPerfil);
    }, [idUsuario])

    if(!datosPerfil) return <h3>Cargando...</h3>

    return(
        <main>
            <h1>{ datosPerfil.nombre }</h1>
            <p><span>Nombre:</span> { datosPerfil.nombre }</p>
            <p><span>Correo:</span> { datosPerfil.correo }</p>
            <p><span>Rol:</span> { datosPerfil.rol }</p>
        </main>
    )
}

export default Perfil;