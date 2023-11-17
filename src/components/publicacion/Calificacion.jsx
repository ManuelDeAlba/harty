import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthProvider";
import usePermisos from "../../hooks/usePermisos";

import { guardarCalificacion, obtenerCalificacion } from "../../firebase";
import { truncarCalificacion } from "../../utils";

function Calificacion({ calificaciones, setCalificaciones }){
    const { idPublicacion } = useParams();
    const navigate = useNavigate();

    const { usuario } = useAuth();

    // Obtiene permisos por rol para permitir o proteger las acciones
    const { permiso: permisoCalificar, error: errorCalificar } = usePermisos(["accion/calificar-terraza"]);

    const handleCalificacion = async cal => {
        // Si no tiene permisos para realizar esa acción
        if(!permisoCalificar){
            toast.error(errorCalificar.message);
            if(errorCalificar.code != "harty/unverified-account" && errorCalificar.code != "harty/disabled-account") navigate("/iniciar-sesion");
            return;
        }
        
        let nuevaCal = cal == calificaciones.usuario ? 0 : cal;

        // Se cambia en la base de datos
        await guardarCalificacion({
            idPublicacion,
            idUsuario: usuario.id,
            calificacion: nuevaCal
        });

        // Se obtienen los nuevos valores
        const { calificacionTotal, calificacionUsuario } = await obtenerCalificacion({
            idPublicacion,
            idUsuario: usuario.id
        });

        // Se actualiza el estado para el renderizado
        setCalificaciones({
            total: calificacionTotal,
            usuario: calificacionUsuario
        });
    }

    return(
        <div className="calificacion">
            <span className="calificacion__titulo"><b>Calificacion:</b> {truncarCalificacion(calificaciones.total)}</span>
            <div className="calificacion__estrellas">
                <span className={`calificacion__estrella${calificaciones.usuario >= 1 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(1)}>&#9733;</span>
                <span className={`calificacion__estrella${calificaciones.usuario >= 2 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(2)}>&#9733;</span>
                <span className={`calificacion__estrella${calificaciones.usuario >= 3 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(3)}>&#9733;</span>
                <span className={`calificacion__estrella${calificaciones.usuario >= 4 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(4)}>&#9733;</span>
                <span className={`calificacion__estrella${calificaciones.usuario >= 5 ? " calificacion__estrella--activa" : ""}`} onClick={() => handleCalificacion(5)}>&#9733;</span>
            </div>
        </div>
    )
}

export default Calificacion;