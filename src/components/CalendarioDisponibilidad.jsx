import { useEffect, useState } from "react";

import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";


const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const esBisiesto = (anio) => {
    return anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0);
}

const obtenerDiasMes = (mes, bisiesto) => {
    const diasMes = {
        1: 31,
        2: bisiesto ? 29 : 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };

    return diasMes[mes];
}

function CalendarioDisponibilidad({ name, className, value, onInput: handleInput=()=>{}, readonly=false }){
    const [cargando, setCargando] = useState(true);

    const [mes, setMes] = useState(new Date().getMonth() + 1); // Para cambiar a meses anteriores o siguientes
    const [anio, setAnio] = useState(new Date().getFullYear());

    const [fechaCalendario, setFechaCalendario] = useState(null); // Para renderizar los datos en el calendario
    const [elementos, setElementos] = useState(null); // Días a renderizar en el calendario

    const [diasSeleccionados, setDiasSeleccionados] = useState(value);

    const handleClick = fecha => {
        if(readonly) return;

        setDiasSeleccionados(prev => {
            if(prev.includes(fecha)){
                return prev.filter(dia => fecha != dia)
            } else {
                return [...prev, fecha];
            }
        })
    }

    // Cada que cambie el value del componente, se actualiza el estado para renderizar los días seleccionados
    useEffect(() => {
        // Para limpiar la base de datos, solo se aceptan fechas de el año actual
        // y también en el onInput se envian las fechas válidas
        const fechasValidas = value.filter(fecha => {
            const anioActual = new Date().getFullYear();
            const anio = fecha.split("-")[2];

            return anio >= anioActual;
        })

        // Si no hay cambios, no hace nada (esto corta el ciclo infinito)
        if(JSON.stringify(fechasValidas) == JSON.stringify(diasSeleccionados)) return;

        setDiasSeleccionados(fechasValidas);
    }, [value])

    // Cada que se actualice con el click, se envia la información al componente padre
    useEffect(() => {
        if(readonly) return;

        handleInput({
            target: {
                name,
                value: diasSeleccionados
            }
        });
    }, [diasSeleccionados])

    useEffect(() => {
        setCargando(true);

        const fechaHoy = new Date(); // Esta fecha es para remarcar con otros estilos el dia actual
        const fechaCalendario = new Date(`${mes}-${1}-${anio}`);
        const bisiesto = esBisiesto(fechaCalendario.getFullYear()); // Para calcular los dias de febrero
        const diasMes = obtenerDiasMes(fechaCalendario.getMonth() + 1, bisiesto); // Para hacer suficientes elementos y renderizarlos
        const diaSemana = fechaCalendario.getDay(); // Para los estilos del calendario
        
        setFechaCalendario(fechaCalendario);

        let elementos = [];
        for(let i = 0; i < diasMes; i++){
            let d = String(i + 1).padStart(2, 0);
            let m = String(fechaCalendario.getMonth() + 1).padStart(2, 0);
            let a = fechaCalendario.getFullYear().toString().padStart(2, 0);
            let fecha = `${d}-${m}-${a}`;

            // Aplicamos las clases para los estilos
            const esPrimeraCelda = i === 0;
            const esHoy = i + 1 == fechaHoy.getDate() && mes == fechaHoy.getMonth() + 1 && anio == fechaHoy.getFullYear();
            const seleccionado = diasSeleccionados.includes(fecha);

            let clases = "";
            if(esPrimeraCelda) clases += " calendario__uno";
            if(esHoy) clases += " calendario__hoy";
            if(seleccionado) clases += " calendario__seleccionado";

            // Se recorre el dia en el que empieza
            const estilos = esPrimeraCelda ? { gridColumn: diaSemana + 1 } : {};

            // Cuando un elemento "a" va a ser el padre, no se le pasa key para el div
            // Si no va a tener un "a", entonces recibe key para ponerla
            const elemento = <div className={`calendario__dia${clases}`} style={estilos} onClick={() => handleClick(fecha)} key={i} data-dia={i + 1}></div>

            elementos.push(elemento);
        }

        setElementos(elementos);
        setCargando(false);
    }, [mes, diasSeleccionados])

    const cambiarMes = (cant) => {
        let nuevoMes = mes + cant;
        let nuevoAnio = anio;

        // Para limitar que tanto se puede avanzar o retroceder
        let anioActual = new Date().getFullYear();
        let limiteAnios = 3;

        if(nuevoMes < 1){
            // Cuando se puede cambiar de año
            // Solo se permite regresar hasta el inicio del año actual
            if(nuevoAnio - 1 >= anioActual){
                nuevoAnio--;
                nuevoMes = 12;
            }
        } else if(nuevoMes > 12){
            // Cuando se puede cambiar de año
            if(nuevoAnio + 1 <= anioActual + limiteAnios){
                nuevoAnio++;
                nuevoMes = 1;
            }
        }
        // Este límite sirve cuando ya no puede cambiar de año pero aún así cambia el mes y se sale del rango
        nuevoMes = Math.max(1, Math.min(nuevoMes, 12));

        setMes(nuevoMes);
        setAnio(nuevoAnio);
    }

    if(cargando) return <h3>Cargando...</h3>

    return(
        <div className={`calendario ${className}`}>
            {/* Mes con los botones para recorrer */}
            <div className="calendario__fecha">
                <button type="button" className="calendario__boton" onClick={() => cambiarMes(-1)}><FaArrowLeft /></button>
                <h2 className="calendario__mes">{MESES[fechaCalendario.getMonth()]} {fechaCalendario.getFullYear()}</h2>
                <button type="button" className="calendario__boton" onClick={() => cambiarMes(1)}><FaArrowRight /></button>
            </div>

            {/* Titulos de dia */}
            <div className="calendario__titulo">DOM</div>
            <div className="calendario__titulo">LUN</div>
            <div className="calendario__titulo">MAR</div>
            <div className="calendario__titulo">MIÉ</div>
            <div className="calendario__titulo">JUE</div>
            <div className="calendario__titulo">VIE</div>
            <div className="calendario__titulo">SÁB</div>

            {/* Días del mes */}
            { elementos }
        </div>
    )
}

export default CalendarioDisponibilidad;