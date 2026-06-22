import React from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./Login.jsx";
import Administrator from "./Administrator.jsx";
import Chat from "./Chat.jsx";
import Registro from "./Registro.jsx";
import NoAutorizado from "./NoAutorizado.jsx";
import Ejercicio from "./Ejercicio.jsx";
import Probar from "./Probar.jsx";

class BootstrapReact extends React.Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/administrator" element={<Administrator />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/no-autorizado" element={<NoAutorizado />} />
          <Route path="/ejercicio/:id" element={<Ejercicio />} />
          <Route path="/probar/:id" element={<Probar />} />
        </Routes>
      </div>
    );
  }
}

export default BootstrapReact;
