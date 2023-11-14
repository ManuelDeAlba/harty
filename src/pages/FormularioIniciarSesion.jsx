import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ERRORES_FIREBASE } from "../utils";
import toast from "react-hot-toast";
import { FaEnvelope, FaEye} from 'react-icons/fa';
import { FaLock} from 'react-icons/fa';

function FormularioIniciarSesion(){
    const { iniciarSesion, restablecerContrasena } = useAuth();
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        correo: "",
        contrasena: ""
    });

    const restablecer = () => {
        // Se envia el correo para restablecer la contraseña
        toast.promise(restablecerContrasena(datos.correo), {
            loading: "Enviando correo...",
            success: "Correo para restablecer la contraseña enviado",
            error: (error) => ERRORES_FIREBASE.AUTH[error.code] || error.message
        });
    }
    
    const handleSubmit = async e => {
        e.preventDefault();

        toast.promise(iniciarSesion({
            correo: datos.correo,
            contrasena: datos.contrasena
        }), {
            loading: "Iniciando sesión...",
            success: () => {
                navigate("/");
                return "Sesión iniciada";
            },
            error: (error) => ERRORES_FIREBASE.AUTH[error.code] || error.message
        });
    }

    const handleInput = e => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    }

    const handleOjo = () => {
        let input = document.getElementById('contrasena');
        if(input.type == "password") input.type = "text";
        else input.type = "password";
    }

    return(
        <main className="contenedor-sesion">
            <form className="form__sesion" onSubmit={handleSubmit}>
                <h1 className="form__titulo">Inicio de sesión</h1>
                <div className="form__input form__input--border-bottom">
                    <FaEnvelope className="form__icono" />
                    <input
                        className="form__campo"
                        name="correo"
                        id="correo"
                        type="email"
                        onInput={handleInput}
                        value={datos.correo}
                        required
                        placeholder="Correo:"
                    />
                </div>

                <div className="form__input form__input--border-bottom">
                    <FaLock className="form__icono" />
                    <input
                        className="form__campo"
                        name="contrasena"
                        id="contrasena"
                        type="password"
                        onInput={handleInput}
                        value={datos.contrasena}
                        required
                        placeholder="Contraseña:"
                    />
                    <button
                        className="form__icono form__ojo"
                        type="button"
                        onClick={handleOjo}
                    ><FaEye /></button>
                </div>
                <input type="submit" value="Iniciar sesión" className="form__boton boton" />
                <span className="form__restablecer" onClick={restablecer}>Olvidé mi contraseña</span>
            </form>
        </main>
    )
}

export default FormularioIniciarSesion;