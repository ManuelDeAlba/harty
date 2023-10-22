import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadScripts from '../components/LoadScripts';

import { crearPublicacion } from "../firebase";

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

    multimedia: "", // files
    disponibilidad: "", // ? (ver como poner en el HTML)
}

function FormularioPublicarTerraza(){
    const navigate = useNavigate();

    const [datos, setDatos] = useState({ ...datosDefault });
    const [errores, setErrores] = useState(null);

    const handleSubmit = async e => {
        e.preventDefault();

        toast.promise(crearPublicacion(datos), {
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
    }

    const handleInput = e => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            {LoadScripts()}
            <br/><br/><br/><br/>
            <h1>FormularioPublicarTerraza</h1>
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
                <h4>Falta multimedia</h4>
                {/* <label htmlFor="multimedia">Multimedia:</label>
                <input
                    name="multimedia"
                    id="multimedia"
                    type="file"
                    multiple
                    onInput={handleInput}
                    value={datos.multimedia}
                    required
                /> */}
            </div>

            <div>
                <h4>Falta disponibilidad</h4>
            </div>

            <input type="submit" value="Publicar" />
        </form>
    )
}

export default FormularioPublicarTerraza;