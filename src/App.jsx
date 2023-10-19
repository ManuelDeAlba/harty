import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

// Componentes
import Navbar from "./components/Navbar";
import Protegido from "./components/Protegido";
import Head from './components/Head';


function App(){
    useEffect(() => {
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
    
        const scriptsToLoad = [
          'assets/js/jquery-1.11.3.min.js',
          'assets/bootstrap/js/bootstrap.min.js',
          'assets/js/jquery.countdown.js',
          'assets/js/jquery.isotope-3.0.6.min.js',
          'assets/js/waypoints.js',
          'assets/js/owl.carousel.min.js',
          'assets/js/jquery.magnific-popup.min.js',
          'assets/js/jquery.meanmenu.min.js',
          'assets/js/sticker.js',
          'assets/js/main.js'
        ];
    
        loadScripts(scriptsToLoad, () => {
          // Los scripts se han cargado, puedes realizar acciones adicionales si es necesario
        });
      }, []);

    return(
        <AuthProvider>
            <Head />
           
            <Router>
                <Navbar />
                <Toaster />
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/publicaciones" element={<Publicaciones />} />
                        <Route path="/publicar-terraza" element={
                            <Protegido name="publicar-terraza" redirect="/iniciar-sesion">
                                <FormularioPublicarTerraza />
                            </Protegido>
                        } />

                    {/* Sesión de usuario */}
                    <Route path="/registrarse" element={<FormularioRegistrarse />} />
                    <Route path="/iniciar-sesion" element={<FormularioIniciarSesion />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App;