import { useEffect, useRef, useState } from "react";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function MapaUbicacion({ className, style, ubicacion={longitud: 0, latitud: 0} }){
    const mapaContenedor = useRef(null);
    const [mapa, setMapa] = useState(null);
    const [marker, setMarker] = useState(null);

    useEffect(() => {
        const { longitud, latitud } = ubicacion;

        const map = new Map({
            container: mapaContenedor.current,
            style: 'mapbox://styles/mapbox/satellite-streets-v11',
            center: [longitud, latitud],
            zoom: 15,
            attributionControl: false
        });

        const marker = new Marker({ color: "#f00" })
        .setLngLat([longitud, latitud])
        .addTo(map);

        map.addControl(new mapboxgl.NavigationControl());

        setMapa(map);
        setMarker(marker);
    }, [])

    // Cuando cambia la ubicación se actualiza la posición
    // Para cuando se cambia de ruta
    useEffect(() => {
        if(!mapa || !marker) return;

        const { longitud, latitud } = ubicacion;

        mapa.setCenter([longitud, latitud]);
        marker.setLngLat([longitud, latitud]);
    }, [mapa, marker, ubicacion])

    return(
        // Estilos temporales
        <div ref={mapaContenedor} className={`mapa ${className}`} />
    )
}

export default MapaUbicacion;