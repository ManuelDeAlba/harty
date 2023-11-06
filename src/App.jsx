import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from 'react';

// Contextos
import AuthProvider from "./context/AuthProvider";
import ModalConfirmProvider from "./context/ModalConfirmProvider";

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
import ScrollToTop from "./components/ScrollToTop";

function App() {
    return (
        <AuthProvider>
            <ModalConfirmProvider>
                {/* <Head /> */}

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
            </ModalConfirmProvider>
        </AuthProvider>
    )
}

export default App;