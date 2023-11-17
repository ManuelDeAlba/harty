import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import { useAuth } from "../../context/AuthProvider";
import usePermisos from "../../hooks/usePermisos";

import { guardarFavorita, obtenerCantidadFavoritas } from "../../firebase";

function Favorita({ cantidadFavoritas, setCantidadFavoritas, favorita, setFavorita }){
    const { idPublicacion } = useParams();
    const navigate = useNavigate();

    const { usuario } = useAuth();

    // Obtiene permisos por rol para permitir o proteger las acciones
    const { permiso: permisoFavorita, error: errorFavorita } = usePermisos(["accion/favorita-terraza"]);

    const handleFavorita = async (estado) => {
        // Si no tiene permisos para realizar esa acción
        if(!permisoFavorita){
            toast.error(errorFavorita.message);
            if(errorFavorita.code != "harty/unverified-account" && errorFavorita.code != "harty/disabled-account") navigate("/iniciar-sesion");
            return;
        }

        // Se cambia en la base de datos
        await guardarFavorita({
            idPublicacion,
            idUsuario: usuario.id,
            favorita: estado
        })

        // Se actualiza la cantidad de personas que le han dado en favorita
        const cant = await obtenerCantidadFavoritas(idPublicacion);
        
        setFavorita(estado);
        setCantidadFavoritas(cant);
    }

    return(
        <div className="favoritos">
            <span><b>{cantidadFavoritas}</b></span>
            <span onClick={() => handleFavorita(!favorita)} className="favoritos__corazon">
                {
                    favorita ?
                        <AiFillHeart /> :
                        <AiOutlineHeart />
                }
            </span>
        </div>
    )
}

export default Favorita;