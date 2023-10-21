import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useAuth } from "../context/AuthProvider";

/*
    name - nombre de la acción
    type ("route", "component") - Si se protege una ruta, redirige a otro lugar, si se protege un componente, simplemente no lo muestra
    redirect - Ruta a donde redirige si no se tienen los permisos
*/
const permisoDefault = false;
function Protegido({ name, type="route", redirect="/", children }){
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

            // Obtenemos el permiso de firebase (true o false), si no existe pone permisoDefault por defecto
            let autorizado = permisos[rol]?.[name] ?? permisoDefault;

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