import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { estadoUsuario, obtenerUsuariosPaginacion } from "../../firebase";

function ListaUsuarios(){
    const [usuarios, setUsuarios] = useState([]);
    const [ultimoDocumento, setUltimoDocumento] = useState(null);

    useEffect(() => {
        obtenerUsuariosPaginacion()
        .then(({ ultimo, usuarios }) => {
            if(usuarios.length){
                setUltimoDocumento(ultimo);
                setUsuarios(usuarios);
            }
        });
    }, [])

    const handleCargarUsuarios = () => {
        obtenerUsuariosPaginacion({ ref: ultimoDocumento })
        .then(({ ultimo, usuarios }) => {
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

    return(
        <main>
            <h1>Administración de usuarios</h1>

            <section>
                {
                    usuarios && usuarios.map(usuario => (
                        <div style={{margin: "2rem 0"}} key={usuario.id}>
                            <p><b>ID.-</b> {usuario.id}</p>
                            <p>{usuario.rol} - {usuario.nombre}</p>
                            <p>{usuario.correo}</p>
                            <Link to={`/perfil/${usuario.id}`}>Perfil</Link>
                            <button onClick={() => handleDeshabilitar(usuario.id, !usuario.habilitado)}>{usuario.habilitado ? "Deshabilitar" : "Habilitar"}</button>
                        </div>
                    ))
                }
                <button onClick={handleCargarUsuarios}>Cargar más usuarios</button>
            </section>
        </main>
    )
}

export default ListaUsuarios;