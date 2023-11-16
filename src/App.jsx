import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import React, { useEffect } from 'react';

// Contextos
import AuthProvider from "./context/AuthProvider";
import ModalConfirmProvider from "./context/ModalConfirmProvider";

// Paginas
import Inicio from "./pages/Inicio";
import Publicaciones from "./pages/Publicaciones";
import Publicacion from "./pages/Publicacion";
import FormularioPublicarTerraza from "./pages/FormularioPublicarTerraza";
import FormularioRegistrarse from "./pages/FormularioRegistrarse";
import FormularioIniciarSesion from "./pages/FormularioIniciarSesion";
import Perfil from "./pages/Perfil";
import FormularioEditarPerfil from "./pages/FormularioEditarPerfil";
import ListaUsuarios from "./pages/admin/ListaUsuarios";
import SolicitudesCertificacion from "./pages/admin/SolicitudesCertificacion";
import ReportesPublicaciones from "./pages/admin/ReportesPublicaciones";
import MenuAdministracion from "./pages/admin/MenuAdministracion";

// Componentes
import Navbar from "./components/Navbar";
import Protegido from "./components/Protegido";
import ScrollToTop from "./components/ScrollToTop";

function App() {
    return (
        <AuthProvider>
            <ModalConfirmProvider>
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
                                <Protegido names={["editar-terraza", "publicacion/editar-terraza"]} paramURL="idPublicacion" redirect="/publicaciones">
                                    <FormularioPublicarTerraza />
                                </Protegido>
                            } />
                            <Route path="/publicacion/:idPublicacion" element={<Publicacion />} />

                            {/* Sesión de usuario */}
                            <Route path="/registrarse" element={<FormularioRegistrarse />} />
                            <Route path="/iniciar-sesion" element={<FormularioIniciarSesion />} />
                            <Route path="/perfil/:idUsuario" element={
                                // Se verifican los permisos generales (por rol) y de usuario (solo para su propio perfil)
                                <Protegido names={["ver-perfil", "usuario/ver-perfil"]} paramURL="idUsuario">
                                    <Perfil />
                                </Protegido>
                            } />
                            <Route path="/editar-perfil/:idUsuario" element={
                                // Se verifican los permisos generales (por rol) y de usuario (solo para su propio perfil)
                                <Protegido names={["editar-perfil", "usuario/editar-perfil"]} paramURL="idUsuario">
                                    <FormularioEditarPerfil />
                                </Protegido>
                            } />

                            {/* Administración */}
                            <Route path="/admin" element={
                                <Protegido names={["administracion"]}>
                                    <MenuAdministracion />
                                </Protegido>
                            } />
                            <Route path="/admin/lista-usuarios" element={
                                <Protegido names={["administracion"]}>
                                    <ListaUsuarios />
                                </Protegido>
                            } />
                            <Route path="/admin/lista-certificaciones" element={
                                <Protegido names={["administracion"]}>
                                    <SolicitudesCertificacion />
                                </Protegido>
                            } />
                            <Route path="/admin/lista-reportes" element={
                                <Protegido names={["administracion"]}>
                                    <ReportesPublicaciones />
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