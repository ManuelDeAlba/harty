import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ERRORES_FIREBASE } from "../utils";
import toast from "react-hot-toast";
import LoadScripts from '../components/LoadScripts';


function FormularioRegistrarse(){
    const { registrarUsuario } = useAuth();
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        nombre: "",
        correo: "",
        contrasena: ""
    });
    
    const handleSubmit = async e => {
        e.preventDefault();

        toast.promise(registrarUsuario({
            nombre: datos.nombre,
            correo: datos.correo,
            contrasena: datos.contrasena
        }), {
            loading: 'Registrando usuario...',
            success: () => {
                navigate("/");
                return (
                    <div>
                        <div>Usuario registrado.</div>
                        <div>Correo de verificación enviado.</div>
                    </div>
                )
            },
            error: (error) => ERRORES_FIREBASE.AUTH[error.code] || error.message
        })
    }

    const handleInput = e => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    }

    return(
        <form onSubmit={handleSubmit}>
            {LoadScripts()}
            <br/><br/><br/><br/>
            <h1>Registro</h1>

            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    name="nombre"
                    id="nombre"
                    type="text"
                    onInput={handleInput}
                    value={datos.nombre}
                    required
                />
            </div>
            
            <div>
                <label htmlFor="correo">Correo:</label>
                <input
                    name="correo"
                    id="correo"
                    type="email"
                    onInput={handleInput}
                    value={datos.correo}
                    required
                />
            </div>

            <div>
                <label htmlFor="contrasena">Contraseña:</label>
                <input
                    name="contrasena"
                    id="contrasena"
                    type="password"
                    onInput={handleInput}
                    value={datos.contrasena}
                    required
                />
            </div>

            <input type="submit" value="Registrarse" />
        </form>
    )
}

export default FormularioRegistrarse;