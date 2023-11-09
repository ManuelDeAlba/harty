import { useEffect, useRef, useState } from "react";

import mapboxgl, { Map, Marker } from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

import { obtenerUbicacion } from "../utils";

mapboxgl.accessToken = 'pk.eyJ1IjoiZmVybmFuZG8tbWFudWVsIiwiYSI6ImNsb3B4cnAxYTBicnEya3B0MjdldzJ6czAifQ.NkNzuxywuW5RK8slFqWXlw';

function SelectorDeUbicacion({ name, value, onInput: handleInput, geolocalizacion }){
    let mapaContenedor = useRef(null);
    const [mapa, setMapa] = useState(null);
    const [marker, setMarker] = useState(null);

    const [actualizado, setActualizado] = useState(false);

    const handleMove = e => marker.setLngLat(mapa.getCenter());
    const handleMoveEnd = e => {
        let {lng: longitud, lat: latitud} = mapa.getCenter();

        // Se simula un evento y se cambia el estado
        handleInput({
            target: {
                name,
                value: { longitud, latitud }
            }
        })
    }
    
    // Solo la primera vez se crea y configura el mapa y el marcador
    const cargarMapa = async () => {
        let { longitud, latitud } = value;

        // Se obtienen las coordenadas
        if(geolocalizacion){
            let coords = await obtenerUbicacion();

            longitud = coords?.longitud || longitud;
            latitud = coords?.latitud || latitud;
        }

        let map = new Map({
            container: mapaContenedor.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            center: [longitud, latitud],
            zoom: 15,
            attributionControl: false
        });

        const marker = new Marker({ color: "#f00" })
        .setLngLat([longitud, latitud])
        .addTo(map);

        // Controles para acercar, alejar y girar
        map.addControl(new mapboxgl.NavigationControl());

        // Controles para ir a la ubicación del usuario
        map.addControl(new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            }
        }));

        setMapa(map);
        setMarker(marker);
    }

    // Cuando ya se tiene mapa y un value se quitan los posibles eventos y se actualiza la posición
    // Para evitar enviar el estado y hacer un ciclo infinito
    const actualizarPosicionMapa = () => {
        if(mapa && !actualizado){
            // Se quitan los eventos para evitar que se modifique el estado
            mapa.off("move", handleMove);
            mapa.off("moveend", handleMoveEnd);

            // Se actualiza la posición
            mapa.setCenter([value.longitud, value.latitud]);
            marker.setLngLat(mapa.getCenter());
        }
    }

    // Cuando ya está actualizado, solo si ya hay value, se vuelven a poner los eventos
    const agregarEventos = () => {
        mapa.on("move", handleMove);
        mapa.on("moveend", handleMoveEnd);
    }

    useEffect(() => {
        cargarMapa();
    }, [])
    
    useEffect(() => {
        if(mapa && value){
            actualizarPosicionMapa();

            // Ya que se actualiza, se vuelven a poner los eventos
            setActualizado(true);
        }
    }, [mapa, value])

    useEffect(() => {
        if(mapa && value && actualizado){
            agregarEventos();

            // Después de poner los eventos se reinicia el estado para poder mover de nuevo
            setActualizado(false);
        }
    }, [actualizado])

    return(
        // Estilos temporales
        <div ref={mapaContenedor} style={{width: "90%", maxWidth: "500px", aspectRatio: "1/1"}} className="mapa" />
    )
}

export default SelectorDeUbicacion;