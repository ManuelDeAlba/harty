import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function FormularioIniciarSesion(){
    const { iniciarSesion } = useAuth();
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        correo: "",
        contrasena: ""
    });
    
    const handleSubmit = async e => {
        e.preventDefault();

        try{
            await iniciarSesion({
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
            <h1>Inicio de sesión</h1>
            
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

            <input type="submit" value="Iniciar sesión" />
        </form>
    )
}

export default FormularioIniciarSesion;