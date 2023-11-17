import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { GoPaperAirplane, GoTrash } from "react-icons/go";

import { useAuth } from "../../context/AuthProvider";
import { useModal } from "../../context/ModalConfirmProvider";
import usePermisos from "../../hooks/usePermisos";

import { borrarComentario, enviarComentario } from "../../firebase";

import Protegido from "../Protegido";

function Comentarios({ comentarios }){
    const { idPublicacion } = useParams();
    const navigate = useNavigate();

    const { usuario } = useAuth();
    const { abrirModal, cerrarModal } = useModal();

    // Obtiene permisos por rol para permitir o proteger las acciones
    const { permiso: permisoComentar, error: errorComentar } = usePermisos(["accion/comentar-terraza"]);

    const handleComentario = async (e) => {
        e.preventDefault();

        // Si no tiene permisos para realizar esa acción
        if(!permisoComentar){
            toast.error(errorComentar.message);
            if(errorComentar.code != "harty/unverified-account" && errorComentar.code != "harty/disabled-account") navigate("/iniciar-sesion");
            return;
        }

        const comentario = e.target.comentario.value;
        
        // Se limpia el formulario
        e.target.reset();

        toast.promise(enviarComentario({
            idPublicacion,
            idUsuario: usuario.id,
            comentario
        }), {
            loading: "Publicando comentario...",
            success: "Comentario publicado",
            error: (error) => error.message
        });
    }

    const handleBorrarComentario = async (idComentario) => {
        abrirModal({
            texto: "¿Realmente quieres borrar el comentario?",
            onResult: (res) => {
                if(res){
                    toast.promise(borrarComentario(idComentario), {
                        loading: "Borrando comentario...",
                        success: "Comentario borrado",
                        error: (error) => error.message
                    });
                }

                cerrarModal();
            }
        })
    }

    return(
        <div className="comentarios">
            <span><b>Comentarios</b></span>
            <form className="comentarios__form" onSubmit={handleComentario}>
                <textarea
                    className="comentarios__textarea"
                    name="comentario"
                    placeholder="Deja tu comentario..."
                    cols="30"
                    rows="2"
                    required
                ></textarea>
                <button className="comentarios__boton boton" type="submit"> Enviar <GoPaperAirplane className="comentarios__boton--icono" /> </button>
            </form>
            <div className="comentarios__lista">
                {
                    comentarios.map(({id, comentario, usuario: { nombre }}) => (
                        <div className="comentarios__contenedor-comentario" key={id}>
                            <span className="comentarios__comentario"><b>{nombre}<br/></b> {comentario}</span>
                            <Protegido
                                // Puede borrar comentario si es admin o el dueño del comentario
                                names={["borrar-comentario", "comentario/borrar-comentario"]}
                                type="component"
                                params={{idComentario: id}}
                                cargandoComponent={""}
                                errorComponent={""}
                            >
                                <button className="comentarios__comentario-boton boton boton--outlined" onClick={() => handleBorrarComentario(id)}><GoTrash className="publicacion__boton--icono"/>Eliminar</button>
                            </Protegido>
                        </div>
                    ))    
                }
            </div>
        </div>
    )
}

export default Comentarios;