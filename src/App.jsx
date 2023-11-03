import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from 'react';

// Contextos
import AuthProvider from "./context/AuthProvider";

// Paginas
import Inicio from "./pages/Inicio";
import Publicaciones from "./pages/Publicaciones";
import FormularioPublicarTerraza from "./pages/FormularioPublicarTerraza";
import FormularioRegistrarse from "./pages/FormularioRegistrarse";
import FormularioIniciarSesion from "./pages/FormularioIniciarSesion";
import Perfil from "./pages/Perfil";
import FormularioEditarPerfil from "./pages/FormularioEditarPerfil";
import ListaUsuarios from "./pages/admin/ListaUsuarios";

// Componentes
import Navbar from "./components/Navbar";
import Protegido from "./components/Protegido";
import Head from './components/Head';
import ScrollToTop from "./components/ScrollToTop";


function App() {
    useEffect(() => {
        const scriptsToLoad = [
            'assets/js/jquery.js',
            'https://code.jquery.com/jquery-3.7.1.min.js',
            'assets/js/jquery-1.11.3.min.js',
            'assets/js/jquery.countdown.js',
            'assets/js/jquery.isotope-3.0.6.min.js',
            'assets/js/jquery.magnific-popup.min.js',
            'assets/js/jquery.meanmenu.min.js',
            'assets/bootstrap/js/bootstrap.min.js',
            'assets/js/waypoints.js',
            'assets/js/owl.carousel.min.js',
            'assets/js/sticker.js',
            'assets/js/main.js'
            // Otros scripts que desees cargar
        ];

        function loadScripts(scripts, callback) {
            const head = document.getElementsByTagName('head')[0];
            let loadedCount = 0;

            function loadScript(index) {
                if (index >= scripts.length) {
                    // Todos los scripts se han cargado
                    callback();
                    return;
                }

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = scripts[index];
                script.async = true;

                script.onload = () => {
                    loadedCount++;
                    if (loadedCount === scripts.length) {
                        // Cuando se han cargado todos los scripts, llamamos al callback
                        callback();
                    } else {
                        // Cargamos el siguiente script
                        loadScript(index + 1);
                    }
                };

                script.onerror = (error) => {
                    // Manejo de errores si el script no se carga correctamente
                    console.error('Error al cargar el script:', error);
                    // Continuamos cargando el siguiente script
                    loadScript(index + 1);
                };

                head.appendChild(script);
            }

            // Comenzamos cargando el primer script
            loadScript(0);
        }

        // Cargamos los scripts en el orden deseado
        loadScripts(scriptsToLoad, () => {
            // Los scripts se han cargado con éxito, aquí puedes realizar otras acciones
        });
    }, []);

    return (
        <AuthProvider>
            <Head />

            <Router>
                <Navbar />
                <Toaster />
                
                <ScrollToTop>
                    <Routes>
                        <Route path="/" element={<Inicio />} />
                        <Route path="/publicaciones" element={<Publicaciones />} />
                        <Route path="/publicar-terraza" element={
                            <Protegido names={["publicar-terraza"]} redirect="/iniciar-sesion">
                                <FormularioPublicarTerraza />
                            </Protegido>
                        } />
                        <Route path="/editar-terraza/:idPublicacion" element={
                            // Se verifican los permisos generales (por rol) y de usuario (para sus propias publicaciones)
                            <Protegido names={["editar-terraza", "publicacion/editar-terraza"]} param="idPublicacion" redirect="/publicaciones">
                                <FormularioPublicarTerraza />
                            </Protegido>
                        } />

                        {/* Sesión de usuario */}
                        <Route path="/registrarse" element={<FormularioRegistrarse />} />
                        <Route path="/iniciar-sesion" element={<FormularioIniciarSesion />} />
                        <Route path="/perfil/:idUsuario" element={
                            // Se verifican los permisos generales (por rol) y de usuario (solo para su propio perfil)
                            <Protegido names={["ver-perfil", "usuario/ver-perfil"]} param="idUsuario">
                                <Perfil />
                            </Protegido>
                        } />
                        <Route path="/editar-perfil/:idUsuario" element={
                            // Se verifican los permisos generales (por rol) y de usuario (solo para su propio perfil)
                            <Protegido names={["editar-perfil", "usuario/editar-perfil"]} param="idUsuario">
                                <FormularioEditarPerfil />
                            </Protegido>
                        } />

                        {/* Administración */}
                        <Route path="/admin/lista-usuarios" element={
                            <Protegido names={["lista-usuarios"]}>
                                <ListaUsuarios />
                            </Protegido>
                        } />

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </ScrollToTop>
            </Router>
        </AuthProvider>
    )
}

export default App;