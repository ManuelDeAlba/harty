import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, obtenerUsuario } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const authContext = createContext();

// Custom hook para obtener la información y funciones del provider
export const useAuth = () => {
    return useContext(authContext);
}

function AuthProvider({ children }){
    const [usuarioAuth, setUsuarioAuth] = useState(null);
    const [usuario, setUsuario] = useState(null);

    // Funciones privadas
    const registrarUsuarioDB = async ({ id, nombre, correo }) => {
        // Se registran los datos del perfil de cada usuario, las contraseñas no se guardan porque firebase/auth ya las maneja de una forma segura
        const docRef = doc(db, "usuarios", id);

        const datosUsuario = {
            id,
            nombre,
            correo,
        }

        await setDoc(docRef, datosUsuario);

        return datosUsuario;
    }

    const enviarVerificacion = async () => {
        await sendEmailVerification(auth.currentUser);
    }

    // Funciones públicas
    const registrarUsuario = async ({ nombre, correo, contrasena }) => {
        // Se registra al usuario en nuestra base de datos
        const usuarioDB = await registrarUsuarioDB({
            id: credenciales.user.uid,
            nombre,
            correo
        });

        // Se registra al usuario y se regresan los datos de la cuenta
        const credenciales = await createUserWithEmailAndPassword(auth, correo, contrasena);

        // Se envia la verificación con el usuario que se acaba de registrar
        await enviarVerificacion();

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

    const actualizarUsuario = async uid => {
        // Al cargar la página o al editar el perfil se obtienen los datos del usuario y se guardan en el contexto
        const usuario = (await obtenerUsuario(uid)).data();

        setUsuarioAuth(auth.currentUser);
        setUsuario(usuario);
    }

    // Al cargar la página se suscribe al evento para obtener los cambios en el auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async currentUser => {
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

    return(
        <authContext.Provider value={{
            usuarioAuth, // Usuario de firebase/auth
            usuario, // Datos de la página
            registrarUsuario,
            iniciarSesion,
            cerrarSesion,
            actualizarUsuario,
        }}>
            {
                children
            }
        </authContext.Provider>
    )
}

export default AuthProvider;