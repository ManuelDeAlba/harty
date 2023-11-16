import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { filtrarElementos } from '../utils';

const filtrosDefault = {
    nombre: "",
    min: "",
    max: "",
    capacidad: ""
}

function FiltroPublicaciones({ publicaciones, onInput: handlePublicacionesFiltradas }){
    const [filtros, setFiltros] = useState(filtrosDefault);

    const handleInput = e => {
        setFiltros(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const handleLimpiar = () => {
        setFiltros(filtrosDefault);
    }

    // Cada que cambian los filtros, se buscan coincidencias
    useEffect(() => {
        let filtrados = publicaciones;

        if(filtros.nombre) filtrados = filtrados.filter(p => filtrarElementos(filtros.nombre, p, "nombreTerraza"));
        if(filtros.min) filtrados = filtrados.filter(p => p.precio >= Number(filtros.min));
        if(filtros.max) filtrados = filtrados.filter(p => p.precio <= Number(filtros.max));
        if(filtros.capacidad) filtrados = filtrados.filter(p => p.capacidad >= Number(filtros.capacidad));

        handlePublicacionesFiltradas(filtrados);
    }, [filtros, publicaciones])

    return(
        <div className='filtros'>
            <div className="filtros__searchbar filtros__input">
                <input
                    name="nombre"
                    type="text"
                    placeholder="Buscar..."
                    value={filtros.nombre}
                    onInput={handleInput}
                />
                <button type="submit"><FaSearch /></button>
            </div>

            <div className="filtros__precio">
                <input
                    className="filtros__input"
                    name="min"
                    type="number"
                    placeholder="Precio mínimo"
                    min={0}
                    value={filtros.min}
                    onInput={handleInput}
                />
                <input
                    className="filtros__input"
                    name="max"
                    type="number"
                    placeholder="Precio máximo"
                    min={0}
                    value={filtros.max}
                    onInput={handleInput}
                />
            </div>

            <input
                className="filtros__capacidad filtros__input"
                name="capacidad"
                type="number"
                placeholder="Capacidad"
                min={0}
                value={filtros.capacidad}
                onInput={handleInput}
            />

            <button className="filtros__limpiar boton" onClick={handleLimpiar}>Limpiar filtros</button>
        </div>
    )
}

export default FiltroPublicaciones;