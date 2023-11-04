import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { borrarMultimedia, borrarPublicacion, crearPublicacion, editarPublicacion, obtenerMultimedia, obtenerPublicacion } from "../firebase";
import { useAuth } from "../context/AuthProvider";

const datosDefault = {
    nombreTerraza: "", // string
    descripcion: "", // string
    reglamento: "", // string - opcional
    direccion: "", //? string por ahora
    telefono: "", // string
    redes: "", //? string (ver como poner en el HTML) - opcional
    precio: "", // number
    horarios: "", //? string (ver como poner en el HTML)
    tamano: "", // string
    capacidad: "", // number
    servicios: "", // string - opcional
    etiquetas: "", // string - opcional

    disponibilidad: "", // ? (ver como poner en el HTML)
}

function FormularioPublicarTerraza(){
    const navigate = useNavigate();
    const { idPublicacion } = useParams();
    const { usuario } = useAuth();

    const [datos, setDatos] = useState({ ...datosDefault });
    const [imgSubidas, setImgSubidas] = useState([]);
    const [multimedia, setMultimedia] = useState([]);
    const [errores, setErrores] = useState(null);

    // Para cambiar entre creación y edición
    useEffect(() => {
        const obtenerDatosEdicion = async () => {
            // Obtenemos todo para rellenar el formulario
            const datos = await obtenerPublicacion(idPublicacion);
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
                    navigate("/publicaciones"); // Redirige a ver las publicaciones
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

        setDatos({
            ...datos,
            [e.target.name]: e.target.value
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
        let res = confirm("¿Realmente quieres borrar la terraza?") // Cambiar por ventana modal para confirmar

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
    }

    return(
        <form onSubmit={handleSubmit}>
            <h1>{!idPublicacion ? "Formulario Publicar Terraza" : "Formulario Editar Terraza"}</h1>

            <div>
                <label htmlFor="nombreTerraza">Nombre de la terraza:</label>
                <input
                    name="nombreTerraza"
                    id="nombreTerraza"
                    type="text"
                    onInput={handleInput}
                    value={datos.nombreTerraza}
                    required
                />
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "nombreTerraza")?.msg }</p>
            </div>

            <div>
                <label htmlFor="descripcion">Descripción:</label>
                <textarea
                    name="descripcion"
                    id="descripcion"
                    cols="30"
                    rows="3"
                    onInput={handleInput}
                    value={datos.descripcion}
                    required
                ></textarea>
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "descripcion")?.msg }</p>
            </div>

            <div>
                <label htmlFor="reglamento">Reglamento:</label>
                <textarea
                    name="reglamento"
                    id="reglamento"
                    cols="30"
                    rows="3"
                    onInput={handleInput}
                    value={datos.reglamento}
                ></textarea>
            </div>

            <div>
                <label htmlFor="direccion">Dirección de la terraza:</label>
                <input
                    name="direccion"
                    id="direccion"
                    type="text"
                    onInput={handleInput}
                    value={datos.direccion}
                    required
                />
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "direccion")?.msg }</p>
            </div>

            <div>
                <label htmlFor="telefono">Teléfono:</label>
                <input
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
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "telefono")?.msg }</p>
            </div>

            <div>
                <label htmlFor="redes">Redes sociales:</label>
                <input
                    name="redes"
                    id="redes"
                    type="text"
                    onInput={handleInput}
                    value={datos.redes}
                />
            </div>

            <div>
                <label htmlFor="precio">Precio:</label>
                <input
                    name="precio"
                    id="precio"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    onInput={handleInput}
                    value={datos.precio}
                    required
                />
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "precio")?.msg }</p>
            </div>

            <div>
                <label htmlFor="horarios">Horarios:</label>
                <input
                    name="horarios"
                    id="horarios"
                    type="text"
                    onInput={handleInput}
                    value={datos.horarios}
                    required
                />
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "horarios")?.msg }</p>
            </div>

            <div>
                <label htmlFor="tamano">Tamaño:</label>
                <input
                    name="tamano"
                    id="tamano"
                    type="text"
                    onInput={handleInput}
                    value={datos.tamano}
                    required
                />
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "tamano")?.msg }</p>
            </div>

            <div>
                <label htmlFor="capacidad">Capacidad de personas:</label>
                <input
                    name="capacidad"
                    id="capacidad"
                    type="number"
                    inputMode="numeric"
                    onInput={handleInput}
                    value={datos.capacidad}
                    required
                />
                <p style={{color: "red"}}>{ errores && errores.find(err => err.name == "capacidad")?.msg }</p>
            </div>

            <div>
                <label htmlFor="servicios">Servicios extras:</label>
                <textarea
                    name="servicios"
                    id="servicios"
                    cols="30"
                    rows="3"
                    onInput={handleInput}
                    value={datos.servicios}
                ></textarea>
            </div>

            <div>
                <label htmlFor="etiquetas">Etiquetas (separadas por ","):</label>
                <input
                    name="etiquetas"
                    id="etiquetas"
                    type="text"
                    onInput={handleInput}
                    value={datos.etiquetas}
                />
            </div>

            <div>
                <label htmlFor="multimedia">Multimedia:</label>
                <input
                    name="multimedia"
                    id="multimedia"
                    type="file"
                    multiple
                    accept="image/*"
                    onInput={handleInput}
                />
                <h2>Subidas</h2>
                {
                    imgSubidas.map(imagen => (
                        !imagen.borrar && (
                            <img width="100" src={imagen.src} key={imagen.referencia.name} onClick={() => handleBorrarMultimediaStorage(imagen.referencia.name)} />
                        )
                    ))
                }
                <h2>Nuevas</h2>
                {
                    multimedia.map(imagen => (
                        <img width="100" src={imagen.src} key={imagen.file.name} onClick={() => handleBorrarMultimediaLocal(imagen.file.name)} />
                    ))
                }
            </div>

            <div>
                <h4>Falta disponibilidad</h4>
            </div>

            {
                idPublicacion && (
                    <button type="button" onClick={() => handleBorrarPublicacion(datos.id)}>Borrar publicación</button>
                )
            }

            <input type="submit" value="Publicar" />
        </form>
    )
}

export default FormularioPublicarTerraza;