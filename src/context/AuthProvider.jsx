import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, obtenerUsuario, obtenerPermisos } from "../firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { ERRORES_HARTY } from "../utils";

const authContext = createContext();

// Custom hook para obtener la información y funciones del provider
export const useAuth = () => {
    return useContext(authContext);
}

function AuthProvider({ children }){
    const [usuarioAuth, setUsuarioAuth] = useState(null);
    const [usuario, setUsuario] = useState(null);
    const [cargandoUsuario, setCargandoUsuario] = useState(true);
    const [permisos, setPermisos] = useState(null);

    // Funciones privadas
    const registrarUsuarioDB = async (datosUsuario) => {
        // Se registran los datos del perfil de cada usuario, las contraseñas no se guardan porque firebase/auth ya las maneja de una forma segura
        const docRef = doc(db, "usuarios", datosUsuario.id);

        await setDoc(docRef, datosUsuario);

        return datosUsuario;
    }

    const enviarVerificacion = async () => {
        await sendEmailVerification(auth.currentUser);
    }

    // Funciones públicas
    const registrarUsuario = async ({ nombre, correo, contrasena }) => {
        setCargandoUsuario(true);
        // Validaciones que no hace firebase (manuales)
        if(!nombre) throw ERRORES_HARTY.MISSING_NAME;

        // Se registra al usuario y se regresan los datos de la cuenta
        const credenciales = await createUserWithEmailAndPassword(auth, correo, contrasena);

        // Se envia la verificación con el usuario que se acaba de registrar
        await enviarVerificacion();

        // Se registra al usuario en nuestra base de datos
        const usuarioDB = await registrarUsuarioDB({
            id: credenciales.user.uid,
            rol: "usuario", // Si no está verificado, automaticamente baja a anonimo
            nombre,
            correo
        });

        // Se cargan los datos del usuario en la sesión activa
        setUsuario(usuarioDB);

        return { usuarioAuth: credenciales.user, usuarioDB };
    }

    const iniciarSesion = async ({ correo, contrasena }) => {
        // Inicia sesión en firebase/auth
        // Los datos del usuario se obtienen al cambiar el estado del auth
        await signInWithEmailAndPassword(auth, correo, contrasena);
    }
    
    const cerrarSesion = async () => {
        await signOut(auth);
    }

    const restablecerContrasena = async (correo) => {
        await sendPasswordResetEmail(auth, correo);
    }

    const editarPerfil = async ({
        id,
        nombre
    }) => {
        // Validaciones que no hace firebase (manuales)
        if(!id) throw ERRORES_HARTY.MISSING_ID;
        if(!nombre) throw ERRORES_HARTY.MISSING_NAME;

        const docRef = doc(db, "usuarios", id);

        await updateDoc(docRef, {
            nombre
        });

        // Se actualiza el usuario del contexto
        await actualizarUsuario(id);
    }

    const actualizarUsuario = async uid => {
        setCargandoUsuario(true);

        // Al cargar la página o al editar el perfil se obtienen los datos del usuario y se guardan en el contexto
        const usuario = await obtenerUsuario(uid);

        setUsuarioAuth(auth.currentUser);
        setUsuario(usuario);
    }

    // Al cargar la página se suscribe al evento para obtener los cambios en el auth
    // También se obtienen los permisos (no se obtienen en tiempo real porque no cambian constantemente)
    useEffect(() => {
        obtenerPermisos()
        .then(setPermisos)

        const unsubscribe = onAuthStateChanged(auth, async currentUser => {
            setCargandoUsuario(true);

            if(currentUser){
                // Se obtienen los datos del usuario (auth y db)
                await actualizarUsuario(currentUser.uid);
            } else {
                setUsuarioAuth(currentUser);
                setUsuario(null);
            }
        })
         
        return () => unsubscribe();
    }, [])

    useEffect(() => {
        if(usuario) setCargandoUsuario(false);
    }, [usuario])

    return(
        <authContext.Provider value={{
            usuarioAuth, // Usuario de firebase/auth
            usuario, // Datos de la página
            cargandoUsuario,
            permisos, // Acciones que puede realizar cada rol
            registrarUsuario,
            iniciarSesion,
            cerrarSesion,
            restablecerContrasena,
            actualizarUsuario,
            editarPerfil,
        }}>
            {
                children
            }
        </authContext.Provider>
    )
}

export default AuthProvider;