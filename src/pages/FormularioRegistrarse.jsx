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
        <form onSubmit={handleSubmit}>
            <div className='container'> 
            <div className='contenedor-registro'>
                <h1>Registro</h1>
                <div className="input-field">
                    <i><FaUser /></i>
                    <label htmlFor="nombre"></label>
                    <input
                        name="nombre"
                        id="nombre"
                        type="text"
                        onInput={handleInput}
                        value={datos.nombre}
                        required
                        placeholder="Nombre:"
                    />
                </div>
                
                <div className="input-field">
                    <i><FaEnvelope/></i>
                    <label htmlFor="correo"></label>
                    <input
                        name="correo"
                        id="correo"
                        type="email"
                        onInput={handleInput}
                        value={datos.correo}
                        required
                        placeholder="Correo:"
                    />
                </div>

                <div className="input-field">
                    <i><FaLock /></i>
                    <label htmlFor="contrasena"></label>
                    <input
                        name="contrasena"
                        id="contrasena"
                        type="password"
                        onInput={handleInput}
                        value={datos.contrasena}
                        required
                        placeholder="Contraseña:"
                    />
                </div>
                 <div className="btn-field">   
                    <input type="submit" value="Registrarse" className="button1" />
                </div>
            </div>
            </div>
        </form>
    )
}

export default FormularioRegistrarse;