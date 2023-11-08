import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { obtenerUsuario } from "../firebase";
import { useAuth } from "../context/AuthProvider";

import Protegido from "../components/Protegido";
import { useModal } from "../context/ModalConfirmProvider";

const datosPerfilDefault = {
    nombre: "",
    rol: ""
}

function FormularioEditarPerfil(){
    const navigate = useNavigate();
    const { idUsuario } = useParams();
    const { editarPerfil } = useAuth();
    const { abrirModal, cerrarModal } = useModal();

    const [datosPerfil, setDatosPerfil] = useState(datosPerfilDefault);

    // Al cambiar la url (id del usuario) se vuelve a obtener todo
    useEffect(() => {
        obtenerUsuario(idUsuario)
        .then(({ nombre, rol }) => {
            setDatosPerfil({
                nombre,
                rol
            });
        });
    }, [idUsuario])

    const handleSubmit = async e => {
        e.preventDefault();

        abrirModal({
            texto: "¿Realmente quieres editar el perfil?",
            onResult: (res) => {
                if(res){
                    toast.promise(editarPerfil({
                        id: idUsuario,
                        ...datosPerfil
                    }), {
                        loading: "Editando perfil...",
                        success: () => {
                            navigate(-1);
                            return "Perfil editado";
                        },
                        error: (error) => error.message
                    });
                }

                cerrarModal();
            }
        })
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

            {/* Solo los que pueden editar todos los perfiles (administradores) */}
            <Protegido names={["editar-perfil"]} type="component" errorComponent={""}>
                <select name="rol" onInput={handleInput} value={datosPerfil.rol}>
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
            </Protegido>

            <input type="submit" value="Editar perfil" />
        </form>
    )
}

export default FormularioEditarPerfil;