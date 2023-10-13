import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

function App(){
    return(
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Inicio />} />
                    <Route path="/publicaciones" element={<Publicaciones />} />
                    <Route path="/publicar-terraza" element={<FormularioPublicarTerraza />} />

                    {/* Sesión de usuario */}
                    <Route path="/registrarse" element={<FormularioRegistrarse />} />
                    <Route path="/iniciar-sesion" element={<FormularioIniciarSesion />} />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App;