import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import { ERRORES_FIREBASE } from "../utils";
import toast from "react-hot-toast";
import { FaUser} from 'react-icons/fa';
import { FaEnvelope} from 'react-icons/fa';
import { FaLock} from 'react-icons/fa';

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
<<<<<<< HEAD
        <main className="contenedor-sesion">
            <form className="form__sesion" onSubmit={handleSubmit}>
                <h1 className="form__titulo">Registro</h1>
                <div className="form__input">
                    <FaUser className="form__icono" />
                    <label htmlFor="nombre"></label>
                    <input
                        className="form__campo"
=======
        <form onSubmit={handleSubmit}>
            <div className='container'> 
            <div className='contenedor-registro'>
                <h1>Registro</h1>
                <div className="input-field">
                    <i><FaUser /></i>
                    <label htmlFor="nombre"></label>
                    <input
>>>>>>> 0d24cb0c9d410a482671090f1b3b04bce875ee97
                        name="nombre"
                        id="nombre"
                        type="text"
                        onInput={handleInput}
                        value={datos.nombre}
                        required
                        placeholder="Nombre:"
                    />
                </div>
                
<<<<<<< HEAD
                <div className="form__input">
                    <FaEnvelope className="form__icono" />
                    <label htmlFor="correo"></label>
                    <input
                        className="form__campo"
=======
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
                    <i><FaLock /></i>
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
                <input type="submit" value="Registrarse" className="form__boton boton" />
            </form>
        </main>
=======
                 <div className="btn-field">   
                    <input type="submit" value="Registrarse" className="button1" />
                </div>
            </div>
            </div>
        </form>
>>>>>>> 0d24cb0c9d410a482671090f1b3b04bce875ee97
    )
}

export default FormularioRegistrarse;