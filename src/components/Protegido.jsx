import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useAuth } from "../context/AuthProvider";

/*
    names - arreglo con los nombres de permisos o acciones
    type ("route", "component") - Si se protege una ruta, redirige a otro lugar, si se protege un componente, simplemente no lo muestra
    redirect - Ruta a donde redirige si no se tienen los permisos
    param - Parametro para comparar con la id del usuario y establecer permisos
*/
const permisoDefault = false;
function Protegido({ names, type="route", redirect="/", param="idUsuario", children }){
    const params = useParams();
    // Parametro para comparar con el id del usuario
    // Por defecto busca id y si no, busca el parametro que se pase, por ejemplo :id, :etc
    const parametro = params[param];

    const { usuario, usuarioAuth, permisos } = useAuth();
    const navigate = useNavigate();

    const [cargando, setCargando] = useState(true);
    const [autorizado, setAutorizado] = useState(permisoDefault);

    useEffect(() => {
        // Cuando ya se hayan obtenido los permisos
        if(permisos){
            setCargando(true);

            // Se obtiene el rol del usuario actual
            let rol = usuario?.rol ?? "anonimo"; // (admin o usuario, si no existe, es anonimo)

            // Si el email no está verificado, se regresa a anonimo en lugar de usuario
            // Solo puede bajar el rol a anonimo si no es admin (admin tiene más peso que la verificación)
            if(rol != "admin" && !usuarioAuth?.emailVerified) rol = "anonimo";

            // Obtenemos los permisos de firebase (true o false), si no existe pone permisoDefault por defecto
            // Si hay algún permiso que cumpla, entonces autoriza (permiso de usuario o por rol)
            let autorizado = names.some(name => {
                if(name.startsWith("usuario/")){
                    // Si el tipo de permiso es solo para paginas del usuario compara por el rol y por la id del usuario
                    return permisos[rol]?.[name] && usuario.id == parametro;
                } else {
                    return permisos[rol]?.[name];
                }
            }) ?? permisoDefault;

            // Actualizamos el estado para el renderizado
            setAutorizado(autorizado);

            // Acciones si no está autorizado
            if(!autorizado && type == "route"){
                // Si es una ruta, redirige a otra ruta
                navigate(redirect);
    
                if(!usuarioAuth){
                    // Si no tiene una sesión activa
                    toast.error("Registrate o inicia sesión y verifica tu cuenta para acceder");
                } else if(!usuarioAuth.emailVerified){
                    // Si solo falta la verificación
                    toast.error("Verifica tu correo electrónico para acceder");
                } else {
                    // Si no tiene los suficientes permisos
                    toast.error("No tienes los permisos suficientes");
                }
            }

            setCargando(false);
        }
    }, [usuarioAuth, permisos])

    // Manejar la renderización, cuando type="route" no renderiza nada porque tiene que redirigir
    if(cargando){
        return <span>Cargando...</span>
    } else if(!autorizado && type == "component"){
        return <span>No tienes los permisos suficientes</span>
    } else if(autorizado){
        // Si el usuario tiene permisos muestra todo normal
        return children;
    }
}

export default Protegido;