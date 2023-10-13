import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ERRORES_FIREBASE } from "../utils";

function FormularioIniciarSesion(){
    const { iniciarSesion, restablecerContrasena } = useAuth();
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        correo: "",
        contrasena: ""
    });

    const restablecer = async () => {
        try{
            await restablecerContrasena(datos.correo);
            console.log("Correo para restablecer la contraseña enviado");
        } catch(error){
            console.log(ERRORES_FIREBASE.AUTH[error.code] || error.message);
        }
    }
    
    const handleSubmit = async e => {
        e.preventDefault();

        try{
            await iniciarSesion({
                correo: datos.correo,
                contrasena: datos.contrasena
            });

            navigate("/");
        } catch(error){
            console.log(ERRORES_FIREBASE.AUTH[error.code] || error.message);
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

            <span onClick={restablecer}>Olvidé mi contraseña</span>
        </form>
    )
}

export default FormularioIniciarSesion;