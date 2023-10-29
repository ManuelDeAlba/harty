import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { obtenerUsuario } from "../firebase";
import { useAuth } from "../context/AuthProvider";

const datosPerfilDefault = {
    nombre: "",
}

function FormularioEditarPerfil(){
    const navigate = useNavigate();
    const { idUsuario } = useParams();
    const { editarPerfil } = useAuth();

    const [datosPerfil, setDatosPerfil] = useState(datosPerfilDefault);

    // Al cambiar la url (id del usuario) se vuelve a obtener todo
    useEffect(() => {
        obtenerUsuario(idUsuario)
        .then(({ nombre }) => {
            setDatosPerfil({
                nombre,
            });
        });
    }, [idUsuario])

    const handleSubmit = async e => {
        e.preventDefault();

        toast.promise(editarPerfil({
            ...datosPerfil,
            id: idUsuario
        }), {
            loading: "Editando perfil...",
            success: () => {
                navigate("/");
                return "Perfil editado";
            },
            error: (error) => error.message
        });
    }

    const handleInput = e => {
        setDatosPerfil({
            ...datosPerfil,
            [e.target.name]: e.target.value
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1>Editar perfil</h1>

            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    name="nombre"
                    id="nombre"
                    type="text"
                    onInput={handleInput}
                    value={datosPerfil.nombre}
                    required
                />
            </div>

            <input type="submit" value="Editar perfil" />
        </form>
    )
}

export default FormularioEditarPerfil;