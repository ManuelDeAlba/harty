export const EXPRESIONES = {
    TELEFONO: /^\d{10}$/,
    PRECIO: /^\d+(\.\d+)?$/,
    CAPACIDAD: /^\d+$/,
}

export class HartyError extends Error{
    constructor({ code, message }){
        super(message);
        this.name = "HartyError";
        this.code = code;
    }
}

// Se crean las instancias de todos los errores para llamarlos con
// throw ERRORES_HARTY.NOMBRE_ERROR
export const ERRORES_HARTY = {
    MISSING_ID: new HartyError({ code: "harty/missing-id", message: "Escribe la id" }),
    MISSING_NAME: new HartyError({ code: "harty/missing-name", message: "Escribe el nombre" }),
    INVALID_DATA: (message) => new HartyError({ code: "harty/invalid-data", message }),
}

export const ERRORES_FIREBASE = {
    AUTH: {
        "auth/invalid-email": "Correo electrónico inválido",
        "auth/missing-password": "Escribe la contraseña",
        "auth/invalid-login-credentials": "Credenciales de inicio de sesión incorrectas. Verifique su usuario y contraseña",
        "auth/missing-email": "Escribe el correo electrónico",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
        "auth/email-already-in-use": "El correo ya está en uso",
        "auth/too-many-requests": "Acceso a la cuenta deshabilitado. Restablezca la contraseña",
    },
}

// FUNCIONES
export function separarEtiquetas(etiquetas){
    return etiquetas.replace(/[^\wñÑáéíóúÁÉÍÓÚ\.\-_,]/g, "").split(/,+/).filter(etiqueta => etiqueta != "");
}

export async function obtenerUbicacion(){
    return await new Promise((res) => {
        navigator.geolocation.getCurrentPosition(geolocation => {
            const {longitude: longitud, latitude: latitud} = geolocation.coords;

            res({ longitud, latitud });
        }, err => {
            res(null);
        })
    })
}
export function truncarCalificacion(calificacion, decimales=1){
    // Si no le pasan la calificación o si no cumple con el formato, no regresa nada
    if(calificacion == undefined || !/[\d\.]+/.test(calificacion.toString())) return;

    const cal = calificacion.toString();    
    const punto = cal.indexOf(".");

    // Si existe un punto se extrae solo lo necesario, si no, se regresa la calificación directamente
    return parseFloat(punto != -1 ? cal.substring(0, punto + 1 + decimales) : calificacion);
}