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
    MISSING_NAME: new HartyError({ code: "harty/missing-name", message: "Escribe el nombre" }),
}

export const ERRORES_FIREBASE = {
    AUTH: {
        "auth/invalid-email": "Correo electrónico inválido",
        "auth/missing-password": "Escribe la contraseña",
        "auth/invalid-login-credentials": "Credenciales de inicio de sesión incorrectas. Verifique su usuario y contraseña",
        "auth/missing-email": "Escribe el correo electrónico",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres",
        "auth/email-already-in-use": "El correo ya está en uso"
    },
}