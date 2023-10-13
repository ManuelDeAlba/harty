import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

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

        try{
            await registrarUsuario({
                nombre: datos.nombre,
                correo: datos.correo,
                contrasena: datos.contrasena
            });

            navigate("/");
        } catch(error){
            console.log({ error });
        }
    }

    const handleInput = e => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    }

    return(
        <form onSubmit={handleSubmit}>
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