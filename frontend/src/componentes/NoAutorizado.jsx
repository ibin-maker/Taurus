import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

class NoAutorizado extends React.Component {
  render() {
    return (
      <div className="container mt-5 text-center">
        <h3 className="text-white">Usuario no registrado en la aplicación web</h3>
        <Link to="/" className="btn btn-primary">
          Volver al login
        </Link>
      </div>
    );
  }
}

export default NoAutorizado;