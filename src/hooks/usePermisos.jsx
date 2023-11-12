import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { ERRORES_HARTY, obtenerRol } from "../utils";

/* Custom hook para obtener permisos globales (por rol), no maneja renderizado ni lógica específica por usuario, solo obtiene los valores de permisos de la base de datos */
function usePermisos(names){
    const { usuario, usuarioAuth, permisos } = useAuth();

    const [permiso, setPermiso] = useState(false);
    const [error, setError] = useState(null);

    const actualizarPermiso = () => {
        if(usuario && usuarioAuth && permisos && names.length > 0){
            //? ROL
            const rol = obtenerRol({ usuario, usuarioAuth });
    
            //? LÓGICA DE PERMISOS
            // Obtenemos los permisos de firebase (true o false), si no existe pone false por defecto
            // Si hay algún permiso que cumpla, entonces autoriza
            let autorizado = Array.isArray(names) ? names.map(name => {
                if(name.startsWith("accion/")){
                    return permisos[rol]?.[name];
                }
            }) : [false];

            setPermiso(autorizado.includes(true));
    
            // Mensajes de error para mostrar si no tiene un permiso
            if(!usuarioAuth){
                // Si no tiene una sesión activa
                setError(ERRORES_HARTY.MISSING_SESSION);
            } else if(!usuarioAuth?.emailVerified){
                // Si solo falta la verificación
                setError(ERRORES_HARTY.UNVERIFIED_ACCOUNT);
            } else if(!usuario?.habilitado) {
                // Si la cuenta está deshabilitada
                setError(ERRORES_HARTY.DISABLED_ACCOUNT);
            } else {
                // Si no tiene los suficientes permisos
                setError(ERRORES_HARTY.CUSTOM_ERROR("No tienes los permisos suficientes"));
            }
        }
    }

    useEffect(() => {
        actualizarPermiso();
    }, [usuario, usuarioAuth, permisos])

    return { permiso, error };
}

export default usePermisos;