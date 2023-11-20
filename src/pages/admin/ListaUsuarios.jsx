import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";

import { HiIdentification } from "react-icons/hi";

import useTitle from "../../hooks/useTitle";

import { estadoUsuario, obtenerUsuariosPaginacion } from "../../firebase";

function ListaUsuarios(){
    const [usuarios, setUsuarios] = useState([]);
    const [ultimoDocumento, setUltimoDocumento] = useState(null);

    useEffect(() => {
        obtenerUsuariosPaginacion({ cantidad: 5 })
        .then(res => {
            if(!res) return;
            
            let { ultimo, usuarios } = res;
            if(usuarios.length){
                setUltimoDocumento(ultimo);
                setUsuarios(usuarios);
            }
        });
    }, [])

    const handleCargarUsuarios = () => {
        obtenerUsuariosPaginacion({ ref: ultimoDocumento, cantidad: 5 })
        .then(res => {
            if(!res){
                toast.error("Ya no hay más usuarios");
                return;
            }
            
            let { ultimo, usuarios } = res;
            if(usuarios.length){
                setUltimoDocumento(ultimo);
                setUsuarios(prev => ([
                    ...prev,
                    ...usuarios
                ]));
            }
        });
    }

    const handleDeshabilitar = async (id, habilitado) => {
        await estadoUsuario(id, habilitado);

        // Se actualizan los datos de los usuarios
        setUsuarios(usuarios => {
            return usuarios.map(usuario => {
                if(usuario.id == id) usuario.habilitado = habilitado
                return usuario;
            })
        })
    }

    useTitle("Harty | Lista de usuarios");

    return(
        <main className="contenedor">
            <h1 className="lista-usuarios__titulo titulo">Administración de usuarios</h1>

            <section className="lista-usuarios">
                {
                    usuarios && usuarios.map(usuario => (
                        <div className="lista-usuarios__usuario" key={usuario.id}>
                            <span className="lista-usuarios__rol">{usuario.rol}</span>
                            <div className="lista-usuarios__identificacion">
                                <HiIdentification className="lista-usuarios__icono" />
                                <Link className={`lista-usuarios__nombre ${!usuario.habilitado ? "lista-usuarios__nombre--deshabilitado" : ""}`} to={`/perfil/${usuario.id}`}>{ usuario.nombre }</Link>
                                <span className="lista-usuarios__id"><b>ID:</b> {usuario.id}</span>
                            </div>
                            <span className="lista-usuarios__correo"><b>Correo:</b> {usuario.correo}</span>
                            <button className="lista-usuarios__boton boton" onClick={() => handleDeshabilitar(usuario.id, !usuario.habilitado)}>{usuario.habilitado ? "Deshabilitar" : "Habilitar"}</button>
                        </div>
                    ))
                }
                <button className="lista-usuarios__boton boton" onClick={handleCargarUsuarios}>Cargar más usuarios</button>
            </section>
        </main>
    )
}

export default ListaUsuarios;