import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio";
import Publicaciones from "./pages/Publicaciones";
import FormularioPublicarTerraza from "./pages/FormularioPublicarTerrazas";
import Navbar from "./components/Navbar";

function App(){
    return(
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/publicaciones" element={<Publicaciones />} />
                <Route path="/publicar-terraza" element={<FormularioPublicarTerraza />} />
            </Routes>
        </Router>
    )
}

export default App;