import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { borrarMultimedia, borrarPublicacion, crearPublicacion, editarPublicacion, obtenerMultimedia, obtenerPublicacion } from "../firebase";
import { useAuth } from "../context/AuthProvider";
import { useModal } from "../context/ModalConfirmProvider";

import SelectorDeUbicacion from "../components/SelectorDeUbicacion";
import CalendarioDisponibilidad from "../components/CalendarioDisponibilidad";

const datosDefault = {
    nombreTerraza: "", // string
    descripcion: "", // string
    reglamento: "", // string - opcional
    direccion: { longitud: -103, latitud: 21 },
    telefono: "", // string
    redes: "", //? string (ver como poner en el HTML) - opcional
    precio: "", // number
    horarios: "", //? string (ver como poner en el HTML)
    tamano: "", // string
    capacidad: "", // number
    servicios: "", // string - opcional
    etiquetas: "", // string - opcional
    disponibilidad: [] // array - opcional
}

function FormularioPublicarTerraza(){
    const navigate = useNavigate();
    const { idPublicacion } = useParams();
    const { usuario } = useAuth();
    const { abrirModal, cerrarModal } = useModal();

    const [datos, setDatos] = useState(null);

    const [imgSubidas, setImgSubidas] = useState([]);
    const [multimedia, setMultimedia] = useState([]);

    const [errores, setErrores] = useState(null);

    // Para cambiar entre creación y edición
    useEffect(() => {
        const obtenerDatosEdicion = async () => {
            // Obtenemos todo para rellenar el formulario
            const datos = await obtenerPublicacion(idPublicacion);
            // Se convierten las etiquetas de arreglo a cadena
            datos.etiquetas = datos.etiquetas?.join(",") ?? "";

            let multimedia = await obtenerMultimedia(datos.id);

            // Para cada imagen, guardar la referencia, src y borrar
            multimedia = multimedia.map(elemento => ({
                ...elemento, // referencia y src
                borrar: false // Para saber si se tiene que borrar de storage
            }))

            setDatos(datos);
            setImgSubidas(multimedia);
        }

        // Al cambiar de ruta se reinician los datos
        setDatos(datosDefault);
        setImgSubidas([]);
        setMultimedia([]);

        // Si se está editando se obtienen los datos para ponerlos en los estados
        if(idPublicacion) obtenerDatosEdicion();
    }, [idPublicacion])

    const handleSubmit = async e => {
        e.preventDefault();
    
        // Datos que se van a subir (crear o editar)
        const publicacion = {
            ...datos,
            multimedia: multimedia.map(imagen => imagen.file), // Solo se envian los archivos y no los src temporales
        }

        if(!idPublicacion){
            // Si no está editando, crea la publicación y agrega la id del usuario
            toast.promise(crearPublicacion({ ...publicacion, idUsuario: usuario.id }), {
                loading: "Publicando terraza...",
                success: () => {
                    navigate("/publicaciones"); // Redirige a ver las publicaciones
                    return "Terraza publicada";
                },
                error: (error) => {
                    setErrores(JSON.parse(error.message));
                    return "Verifique los datos";
                }
            });
        } else {
            // Si está editando, edita la publicación y borra las imagenes si es necesario
            toast.promise(editarPublicacion(publicacion), {
                loading: "Editando terraza...",
                success: () => {
                    navigate(`/publicacion/${publicacion.id}`); // Redirige a ver esa publicación
                    return "Terraza editada";
                },
                error: (error) => {
                    setErrores(JSON.parse(error.message));
                    return "Verifique los datos";
                }
            });

            // Las imagenes se borran en segundo plano de storage
            const imagenesABorrar = imgSubidas.filter(img => img.borrar == true).map(img => img.referencia);
            borrarMultimedia(imagenesABorrar);
        }
    }

    const handleInput = e => {
        if(e.target.name == "multimedia"){
            handleImagenes(e);
            return;
        }

        setDatos(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleImagenes = async e => {
        let imagenes = [];
        // Obtenemos todos los archivos
        let files = e.target.files;
        
        // Por cada archivo, se guardan sus rutas
        for(let i = 0; i < files.length; i++){
            let file = files[i];

            // Si no es una imagen, muestra un error
            if(!file.type.startsWith("image/")){
                toast.error("Solo se permiten imagenes");
                continue;
            }

            // Esperamos a que se termine de leer
            const imagen = await new Promise((res) => {
                const reader = new FileReader();

                reader.onload = (e) => res({file, src: e.target.result});
                
                reader.readAsDataURL(file);
            })

            // Si no existe esa imagen en multimedia, se agrega
            if(!multimedia.some(mult => mult.file.name == imagen.file.name)) imagenes.push(imagen);
            else toast.error("Imagen ya existente");
        }

        setMultimedia([
            ...multimedia,
            ...imagenes
        ]);
    }

    const handleBorrarMultimediaLocal = name => {
        // Borramos las imagenes para no enviarlas y no subirlas a storage
        setMultimedia(prevState => prevState.filter(img => img.file.name !== name));
    }

    const handleBorrarMultimediaStorage = name => {
        setImgSubidas(imagenes => {
            return imagenes.map(img => {
                if(img.referencia.name == name) img.borrar = true;
                return img;
            })
        })
    }

    const handleBorrarPublicacion = (idPublicacion) => {
        abrirModal({
            texto: "¿Realmente quieres borrar la publicación?",
            onResult: (res) => {
                if(res){
                    let promesa = new Promise(async (res) => {
                        // Eliminar imagenes
                        await borrarMultimedia(imgSubidas.map(img => img.referencia));
                        // Eliminar publicacion
                        await borrarPublicacion(idPublicacion);
                        res();
                    })
        
                    toast.promise(promesa, {
                        loading: "Borrando terraza...",
                        success: () => {
                            navigate("/publicaciones"); // Redirige a ver las publicaciones
                            return "Terraza borrada";
                        },
                        error: "Hubo un error"
                    });
                }

                cerrarModal();
            }
        })
    }

    if(!datos) return <span className="contenedor">Cargando...</span>

    return(
        <main className="contenedor-publicar">
            <form className='form__publicar' onSubmit={handleSubmit}>
                <h1 className="form__titulo">{!idPublicacion ? "Publicar Terraza" : "Editar Terraza"}</h1>
                
                <label htmlFor="nombreTerraza">Nombre de la terraza <span className="form__obligatorio">*</span></label>
                <div className="form__input">
                    <input
                        className="form__campo"
                        name="nombreTerraza"
                        id="nombreTerraza"
                        type="text"
                        onInput={handleInput}
                        value={datos.nombreTerraza}
                        required
                    />
                </div>
                <span className="form__error">{ errores && errores.find(err => err.name == "nombreTerraza")?.msg }</span>

                <label htmlFor="descripcion">Descripción <span className="form__obligatorio">*</span></label>
                <div className="form__input">
                    <textarea
                        className="form__campo"
                        name="descripcion"
                        id="descripcion"
                        cols="30"
                        rows="3"
                        onInput={handleInput}
                        value={datos.descripcion}
                        required
                    ></textarea>
                </div>
                <span className="form__error">{ errores && errores.find(err => err.name == "descripcion")?.msg }</span>

                <label htmlFor="reglamento">Reglamento:</label>
                <div className="form__input">
                    <textarea
                        className="form__campo"
                        name="reglamento"
                        id="reglamento"
                        cols="30"
                        rows="3"
                        onInput={handleInput}
                        value={datos.reglamento}
                    ></textarea>
                </div>

                <label>Dirección de la terraza: (Por favor, indique en el mapa la direccion)</label>
                <div className="form__publicar-ubicacion">
                    {
                        <SelectorDeUbicacion
                            name="direccion"
                            onInput={handleInput}
                            value={datos.direccion}
                            // Para saber si se cambió de ruta entre publicar y editar
                            modoEdicion={idPublicacion != undefined}
                        />
                    }
                    <span className="form__error">{ errores && errores.find(err => err.name == "direccion")?.msg }</span>
                </div>

                <label htmlFor="telefono">Teléfono <span className="form__obligatorio">*</span></label>
                <div className="form__input">
                    <input
                        className="form__campo"
                        name="telefono"
                        id="telefono"
                        type="text"
                        inputMode="tel"
                        pattern="\d{10}"
                        minLength={10}
                        maxLength={10}
                        onInput={handleInput}
                        value={datos.telefono}
                        required
                    />
                </div>
                <span className="form__error">{ errores && errores.find(err => err.name == "telefono")?.msg }</span>

                <label htmlFor="redes">Redes sociales:</label>
                <div className="form__input">
                    <input
                        className="form__campo"
                        name="redes"
                        id="redes"
                        type="text"
                        onInput={handleInput}
                        value={datos.redes}
                    />
                </div>

                <label htmlFor="precio">Precio <span className="form__obligatorio">*</span></label>
                <div className="form__input">
                    <input
                        className="form__campo"
                        name="precio"
                        id="precio"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        onInput={handleInput}
                        value={datos.precio}
                        required
                    />
                </div>
                <span className="form__error">{ errores && errores.find(err => err.name == "precio")?.msg }</span>

                <label htmlFor="horarios">Horarios <span className="form__obligatorio">*</span></label>
                <div  className="form__input">
                    <input
                        className="form__campo"
                        name="horarios"
                        id="horarios"
                        type="text"
                        onInput={handleInput}
                        value={datos.horarios}
                        required
                    />
                </div>
                <span className="form__error">{ errores && errores.find(err => err.name == "horarios")?.msg }</span>

                <label htmlFor="tamano">Tamaño <span className="form__obligatorio">*</span></label>
                <div className="form__input">
                    <input
                        className="form__campo"
                        name="tamano"
                        id="tamano"
                        type="text"
                        onInput={handleInput}
                        value={datos.tamano}
                        required
                    />
                </div>
                <span className="form__error">{ errores && errores.find(err => err.name == "tamano")?.msg }</span>

                <label htmlFor="capacidad">Capacidad de personas <span className="form__obligatorio">*</span></label>
                <div className="form__input">
                    <input
                        className="form__campo"
                        name="capacidad"
                        id="capacidad"
                        type="number"
                        inputMode="numeric"
                        onInput={handleInput}
                        value={datos.capacidad}
                        required
                    />
                </div>
                <span className="form__error">{ errores && errores.find(err => err.name == "capacidad")?.msg }</span>

                <label htmlFor="servicios">Servicios extras:</label>
                <div className="form__input">
                    <textarea
                        className="form__campo"
                        name="servicios"
                        id="servicios"
                        cols="30"
                        rows="3"
                        onInput={handleInput}
                        value={datos.servicios}
                    ></textarea>
                </div>

                <label htmlFor="etiquetas">Etiquetas (separadas por ","):</label>
                <div className="form__input">
                    <input
                        className="form__campo"
                        name="etiquetas"
                        id="etiquetas"
                        type="text"
                        onInput={handleInput}
                        value={datos.etiquetas}
                    />
                </div>

                <label>Disponibilidad (seleccione los días apartados):</label>
                <CalendarioDisponibilidad
                    className="form__publicar-calendario"
                    name="disponibilidad"
                    value={datos.disponibilidad}
                    onInput={handleInput}
                />

                <label htmlFor="multimedia">Multimedia:</label>
                <div className="form__input">
                    <input
                     className="form__campo"
                        name="multimedia"
                        id="multimedia"
                        type="file"
                        multiple
                        accept="image/*"
                        onInput={handleInput}
                    />
                </div>    
                    <h2>Subidas</h2>
                    <div className="form__galeria">
                    {
                        imgSubidas.map(imagen => (
                            !imagen.borrar && (
                                <img className="form__img" src={imagen.src} key={imagen.referencia.name} onClick={() => handleBorrarMultimediaStorage(imagen.referencia.name)} />
                            )
                        ))
                    }
                    </div>
                    <h2>Nuevas</h2>
                    <div className="form__galeria">
                    {
                        multimedia.map(imagen => (
                            <img className="form__img" src={imagen.src} key={imagen.file.name} onClick={() => handleBorrarMultimediaLocal(imagen.file.name)} />
                        ))
                    }
                </div>

                <div className="form__botones">
                    {
                        idPublicacion && (
                            <button className="form__boton boton boton--outlined" type="button" onClick={() => handleBorrarPublicacion(datos.id)}>Borrar publicación</button>
                        )
                    }

                    <input type="submit" value={`${!idPublicacion ? "Publicar" : "Editar"}`} className="form__boton boton" />
                </div>
            </form>
        </main>
    )
}

export default FormularioPublicarTerraza;