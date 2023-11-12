import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useAuth } from "../context/AuthProvider";
import { obtenerComentario, obtenerPublicacion } from "../firebase";
import { obtenerRol } from "../utils";

/*
    names - arreglo con los nombres de permisos o acciones
    type ("route", "component") - Si se protege una ruta, redirige a otro lugar, si se protege un componente, simplemente no lo muestra
    redirect - Ruta a donde redirige si no se tienen los permisos
    paramURL - Parametro de la url para comparar con la id del usuario y establecer permisos
    params - Para pasarle parametros extra para realizar operaciones como en el permiso de "comentario/"
*/
const permisoDefault = false;
function Protegido({
    names,
    type="route",
    redirect="/", // route
    paramURL="id", // route y component
    params={}, // route y component
    cargandoComponent=<span>Cargando...</span>,
    errorComponent=<span>No tienes los permisos suficientes</span>,
    children
}){
    const paramsURL = useParams();
    // Parametro para comparar con el id del usuario
    // Por defecto busca id y si no, busca el parametro que se pase, por ejemplo :id, :etc
    const parametroURL = paramsURL[paramURL];

    const { usuario, usuarioAuth, permisos } = useAuth();
    const navigate = useNavigate();

    const [cargando, setCargando] = useState(true);
    const [autorizado, setAutorizado] = useState(permisoDefault);

    useEffect(() => {
        const procesarPermisos = async () => {
            setCargando(true);

            //? ROL
            const rol = obtenerRol({ usuario, usuarioAuth });

            //? LÓGICA DE PERMISOS
            // Obtenemos los permisos de firebase (true o false), si no existe pone permisoDefault por defecto
            // Si hay algún permiso que cumpla, entonces autoriza (permiso de usuario o por rol)
            let autorizado = Array.isArray(names) ? names.map(async name => {
                if(name.startsWith("usuario/")){
                    // Si el tipo de permiso es solo para paginas del usuario compara por el rol y por la id del usuario
                    return permisos[rol]?.[name] && parametroURL == usuario.id;
                } else if(name.startsWith("publicacion/")) {
                    // Si se tiene que proteger una publicación para que solo acceda el creador
                    const publicacion = await obtenerPublicacion(parametroURL);
                    return permisos[rol]?.[name] && publicacion.idUsuario == usuario.id;
                } else if(name.startsWith("comentario")) {
                    // Si solo el dueño del usuario puede hacer un cambio con su propio comentario
                    // Se necesita un params con { idComentario: ... }
                    const comentario = await obtenerComentario(params.idComentario);
                    return permisos[rol]?.[name] && comentario.idUsuario == usuario.id;
                } else {
                    return permisos[rol]?.[name];
                }
            }) : [permisoDefault];

            autorizado = (await Promise.all(autorizado)).includes(true);

            // Actualizamos el estado para el renderizado
            setAutorizado(autorizado);

            // Acciones si no está autorizado
            if(!autorizado && type == "route"){
                // Si es una ruta, redirige a otra ruta
                navigate(redirect);
    
                if(!usuarioAuth){
                    // Si no tiene una sesión activa
                    toast.error("Registrate o inicia sesión y verifica tu cuenta para acceder");
                } else if(!usuarioAuth?.emailVerified){
                    // Si solo falta la verificación
                    toast.error("Verifica tu correo electrónico para acceder");
                } else if(!usuario?.habilitado) {
                    // Si la cuenta está deshabilitada
                    toast.error("La cuenta está deshabilitada");
                } else {
                    // Si no tiene los suficientes permisos
                    toast.error("No tienes los permisos suficientes");
                }
            }

            setCargando(false);
        }

        // Cuando ya se hayan obtenido los permisos
        if(permisos) procesarPermisos();
    }, [usuarioAuth, permisos, location.pathname])

    // Manejar la renderización, cuando type="route" no renderiza nada porque tiene que redirigir
    if(cargando){
        return cargandoComponent;
    } else if(!autorizado && type == "component"){
        return errorComponent;
    } else if(autorizado){
        // Si el usuario tiene permisos muestra todo normal
        return children;
    }
}

export default Protegido;