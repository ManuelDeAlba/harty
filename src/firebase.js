// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, query, orderBy, onSnapshot, getDoc, startAt, limit, startAfter, updateDoc, where, deleteDoc, getCountFromServer } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';

import { EXPRESIONES, ERRORES_HARTY, separarEtiquetas } from "./utils";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

//! Funciones de la base de datos

export async function obtenerUsuario(uid){
    const docRef = doc(db, "usuarios", uid);

    let documento = await getDoc(docRef);

    return documento.data();
}

export async function obtenerUsuariosPaginacion({ ref=null, cantidad=10 } = {}){
	let q = query(collection(db, "usuarios"), orderBy("rol"), orderBy("nombre"), startAfter(ref), limit(cantidad));

	const docs = (await getDocs(q)).docs;
    
    return {
        ultimo: docs[docs.length - 1],
        usuarios: docs.map(doc => doc.data())
    };
}

export async function estadoUsuario(uid, habilitado=false){
    const docRef = doc(db, "usuarios", uid);

    await updateDoc(docRef, {
        habilitado
    });
}

export async function obtenerPermisos(){
    const { docs } = await getDocs(collection(db, "permisos"));

    const permisos = {}
    
    // Por cada documento, guardamos los permisos con la id (rol) como clave
    docs.forEach(doc => permisos[doc.id] = doc.data());

    return permisos;
}

//! Soportar las imagenes y videos, disponibilidad, convertir las etiquetas, etc.
export async function crearPublicacion({
    idUsuario,

    nombreTerraza, // string
    descripcion, // string
    reglamento, // string - opcional
    direccion, // {longitud: 0, latitud: 0}
    telefono, // string
    redes, //? string (ver como poner en el HTML) - opcional
    precio, // number
    horarios, //? string (ver como poner en el HTML)
    tamano, // string
    capacidad, // number
    servicios, // string - opcional
    etiquetas, // array - opcional

    multimedia, // files
    disponibilidad, // ? (ver como poner en el HTML)
}){
    // Validación de datos
    let errores = [];
    if(!nombreTerraza) errores.push({ name: "nombreTerraza", msg: "Escribe un nombre válido" });
    if(!descripcion) errores.push({ name: "descripcion", msg: "Escribe la descripción" });
    if(!direccion) errores.push({ name: "direccion", msg: "Escribe la dirección" });
    if(!telefono || !EXPRESIONES.TELEFONO.test(telefono)) errores.push({ name: "telefono", msg: "Escribe un teléfono válido (10 dígitos)" });
    if(!precio || !EXPRESIONES.PRECIO.test(precio)) errores.push({ name: "precio", msg: "Escribe un precio válido" });
    if(!horarios) errores.push({ name: "horarios", msg: "Escribe el horario" });
    if(!tamano) errores.push({ name: "tamano", msg: "Escribe el tamaño de la terraza" });
    if(!capacidad || !EXPRESIONES.CAPACIDAD) errores.push({ name: "capacidad", msg: "Escribe la capacidad de personas" });

    // Si existen errores no se crea el documento
    if(errores.length) throw ERRORES_HARTY.INVALID_DATA(JSON.stringify(errores));
    
    // Creación del documento
    const id = Date.now().toString();
    const publicacion = {
        idUsuario,
        id,
        nombreTerraza,
        descripcion,
        reglamento,
        direccion,
        telefono,
        redes,
        precio,
        horarios,
        tamano,
        capacidad,
        servicios,
        etiquetas: separarEtiquetas(etiquetas),
        disponibilidad
    }
    const docRef = doc(db, "publicaciones", id);

    // Subida de imagenes a storage
    await subirMultimedia(id, multimedia);

    await setDoc(docRef, publicacion);
}

export async function editarPublicacion({
    id,
    nombreTerraza, // string
    descripcion, // string
    reglamento, // string - opcional
    direccion, // {longitud: 0, latitud: 0}
    telefono, // string
    redes, //? string (ver como poner en el HTML) - opcional
    precio, // number
    horarios, //? string (ver como poner en el HTML)
    tamano, // string
    capacidad, // number
    servicios, // string - opcional
    etiquetas, // array - opcional

    multimedia, // files
    disponibilidad, // ? (ver como poner en el HTML)
}){
    // Validación de datos
    let errores = [];
    if(!nombreTerraza) errores.push({ name: "nombreTerraza", msg: "Escribe un nombre válido" });
    if(!descripcion) errores.push({ name: "descripcion", msg: "Escribe la descripción" });
    if(!direccion) errores.push({ name: "direccion", msg: "Escribe la dirección" });
    if(!telefono || !EXPRESIONES.TELEFONO.test(telefono)) errores.push({ name: "telefono", msg: "Escribe un teléfono válido (10 dígitos)" });
    if(!precio || !EXPRESIONES.PRECIO.test(precio)) errores.push({ name: "precio", msg: "Escribe un precio válido" });
    if(!horarios) errores.push({ name: "horarios", msg: "Escribe el horario" });
    if(!tamano) errores.push({ name: "tamano", msg: "Escribe el tamaño de la terraza" });
    if(!capacidad || !EXPRESIONES.CAPACIDAD) errores.push({ name: "capacidad", msg: "Escribe la capacidad de personas" });

    // Si existen errores no se edita el documento
    if(errores.length) throw ERRORES_HARTY.INVALID_DATA(JSON.stringify(errores));
    
    // Creación del documento
    const publicacion = {
        id,
        nombreTerraza,
        descripcion,
        reglamento,
        direccion,
        telefono,
        redes,
        precio,
        horarios,
        tamano,
        capacidad,
        servicios,
        etiquetas: separarEtiquetas(etiquetas),
        disponibilidad
    }
    const docRef = doc(db, "publicaciones", id);

    // Subida de imagenes a storage
    await subirMultimedia(id, multimedia);

    // Edición de documento
    await updateDoc(docRef, publicacion);
}

export async function obtenerPublicacion(id){
    const docRef = doc(db, "publicaciones", id);

    return (await getDoc(docRef)).data();
}

export async function obtenerPublicaciones(){
    // Se crea la consulta ordenando por fecha de más reciente a menos reciente
    const q = query(collection(db, "publicaciones"), orderBy("id", "desc"));

    // Se obtienen los documentos
    const querySnapshot = await getDocs(q);
    
    // Se recorre para obtener la información de cada documento
    return querySnapshot.docs.map(doc => doc.data());
}

export async function obtenerPublicacionesUsuario(uid){
    // Se crea la consulta ordenando por fecha de más reciente a menos reciente
    const q = query(collection(db, "publicaciones"), where("idUsuario", "==", uid), orderBy("id", "desc"));

    // Se obtienen los documentos
    const querySnapshot = await getDocs(q);
    
    // Se recorre para obtener la información de cada documento
    return querySnapshot.docs.map(doc => doc.data());
}

export function obtenerPublicacionesTiempoReal(callback) {
    // Se crea la consulta ordenando por fecha de más reciente a menos reciente
    const q = query(collection(db, "publicaciones"), orderBy("id", "desc"));

    // Establecer una suscripción a los cambios en la base de datos
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const publicaciones = querySnapshot.docs.map(doc => doc.data());

        callback(publicaciones);
    });

    // Retorna una función para detener la suscripción cuando sea necesario
    return unsubscribe;
}

export async function borrarPublicacion(id){
    const docRef = doc(db, "publicaciones", id);

    await deleteDoc(docRef);
}

export async function guardarFavorita({
    idPublicacion,
    idUsuario,
    favorita
}){
    const docRef = doc(db, "favoritas", `${idPublicacion}-${idUsuario}`);

    // Si ya no es favorita, se borra de la base de datos
    if(!favorita){
        deleteDoc(docRef);
        return;
    }

    await setDoc(docRef, {
        idPublicacion,
        idUsuario,
        favorita
    })
}

export async function obtenerEstadoFavorita({
    idPublicacion,
    idUsuario
}){
    const docRef = doc(db, "favoritas", `${idPublicacion}-${idUsuario}`);

    const documento = await getDoc(docRef);

    return documento.data()?.favorita || false;
}

export async function obtenerCantidadFavoritas(idPublicacion){
    const q = query(collection(db, "favoritas"), where("idPublicacion", "==", idPublicacion));

    const snapshot = await getCountFromServer(q);

    return snapshot.data().count;
}

export async function obtenerPublicacionesFavoritas(idUsuario){
    const q = query(collection(db, "favoritas"), where("idUsuario", "==", idUsuario));
    const favoritas = (await getDocs(q)).docs.map(doc => doc.data());

    const idPublicaciones = favoritas.map(doc => doc.idPublicacion);

    if(idPublicaciones.length <= 0) return [];

    const q2 = query(collection(db, "publicaciones"), where("id", "in", idPublicaciones));
    const publicacionesFavoritas = (await getDocs(q2)).docs.map(doc => doc.data());

    return publicacionesFavoritas;
}

export async function guardarCalificacion({
    idPublicacion,
    idUsuario,
    calificacion
}){
    const docRef = doc(db, "calificaciones", `${idPublicacion}-${idUsuario}`);

    //Si la calificación es 0, se borra de la db

    if(calificacion == 0){
        deleteDoc(docRef);
        return;
    }

    await setDoc(docRef, {
        idPublicacion,
        idUsuario,
        calificacion
    });
}

export async function obtenerCalificacion({
    idPublicacion,
    idUsuario
}){
    // Consulta en la base de datos de las calificaciones donde cumpla con idTerraza
    const q = query(collection(db, "calificaciones"),where("idPublicacion", "==", idPublicacion));

    // Obtener los documentos
    const documentos = (await getDocs(q)).docs.map(doc => doc.data());

    // Calcular la calififación total
    let calificacionTotal = (documentos.reduce((prev, curr) => prev + (curr?.calificacion ?? 0), 0)) / documentos.length;
    calificacionTotal = calificacionTotal || 0;
    // Se busca la calificacion del usuario si existe idUsuario
    let calificacionUsuario = documentos.find(doc => doc.idUsuario == idUsuario)?.calificacion;
    
    // Si existe idUsuario
    if(idUsuario) {
        // Obtener la calificación del usuario con el mismo arreglo
        return { calificacionTotal, calificacionUsuario };
    } else {
        return { calificacionTotal };
    }
}

//! STORAGE
export async function subirMultimedia(carpeta, multimedia){
    const promesas = multimedia.map(file => {
        return new Promise(async res => {
            const referencia = ref(storage, `${carpeta.toString()}/${file.name}`);
    
            let snapshot = await uploadBytes(referencia, file);
            
            res(snapshot.metadata);
        })
    })

    return await Promise.all(promesas);
}

export async function obtenerMultimedia(carpeta){
    const referenciaLista = ref(storage, carpeta.toString());

    // Obtenemos la lista de todos los archivos en el directorio
    let { items: referencias } = await listAll(referenciaLista);

    // Por cada referencia obtenemos su URL
    let imagenes = referencias.map(async referencia => {
        const url = await getDownloadURL(referencia);
        return { referencia, src: url };
    })

    imagenes = await Promise.all(imagenes);

    // Regresa solo las urls
    return imagenes;
}

export async function obtenerPrevisualizacion(carpeta) {
    const referenciaLista = ref(storage, carpeta.toString());
    // Obtenemos la lista de todos los archivos en el directorio
    let { items: referencias } = await listAll(referenciaLista);
    // Verificamos si hay al menos un archivo en la carpeta
    if (referencias.length > 0) {
        // Obtén la URL de descarga del primer archivo
        return await getDownloadURL(referencias[0]);
    } else {
        // No se encontraron archivos en la carpeta
        return null;
    }
}

export async function borrarMultimedia(referencias){
    referencias.map(async referencia => {
        await deleteObject(referencia);
    })
}