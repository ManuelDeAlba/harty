import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ERRORES_FIREBASE } from "../utils";
import toast from "react-hot-toast";
import { FaEnvelope} from 'react-icons/fa';
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

    return(
<<<<<<< HEAD
        <main className="contenedor-sesion">
            <form className="form__sesion" onSubmit={handleSubmit}>
                <h1 className="form__titulo">Inicio de sesión</h1>
                <div className="form__input">
                    <FaEnvelope className="form__icono" />
                    <label htmlFor="correo"></label>
                    <input
                        className="form__campo"
=======
        <form onSubmit={handleSubmit}>
            <div className="container">
            <div className='contenedor-registro'> 
                <h1>Inicio de sesión</h1>
                <div className="input-field">
                    <i><FaEnvelope/></i>
                    <label htmlFor="correo"></label>
                    <input
>>>>>>> 0d24cb0c9d410a482671090f1b3b04bce875ee97
                        name="correo"
                        id="correo"
                        type="email"
                        onInput={handleInput}
                        value={datos.correo}
                        required
                        placeholder="Correo:"
                    />
                </div>

<<<<<<< HEAD
                <div className="form__input">
                    <FaLock className="form__icono" />
                    <label htmlFor="contrasena"></label>
                    <input
                        className="form__campo"
=======
                <div className="input-field">
                    <i><FaLock/></i>
                    <label htmlFor="contrasena"></label>
                    <input
>>>>>>> 0d24cb0c9d410a482671090f1b3b04bce875ee97
                        name="contrasena"
                        id="contrasena"
                        type="password"
                        onInput={handleInput}
                        value={datos.contrasena}
                        required
                        placeholder="Contraseña:"
                    />
                </div>
<<<<<<< HEAD
                <input type="submit" value="Iniciar sesión" className="form__boton boton" />
                <span className="form__restablecer" onClick={restablecer}>Olvidé mi contraseña</span>
            </form>
        </main>
=======
                <div className="btn-field">
                    <input type="submit" value="Iniciar sesión" className="button1" />
                </div>
                <span onClick={restablecer}>Olvidé mi contraseña</span>
            </div>
            </div>
        </form>
>>>>>>> 0d24cb0c9d410a482671090f1b3b04bce875ee97
    )
}

export default FormularioIniciarSesion;