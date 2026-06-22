import React from "react";
import { Button, Container, Table, Alert, Form, FloatingLabel } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function AdministratorWrapper() {
  const navigate = useNavigate();
  return <Administrator navigate={navigate} />;
}

class Administrator extends React.Component {

  state = {
    data: [],
    showAlert: false,
    alertText: "",
    autorizado: true,
  };

  componentDidMount() {
  axios.get("http://localhost:8080/Ejercicios")
    .then(response => {
        this.setState({ data: response.data });
    })
    .catch(error => {
        console.info(error);
        this.setState({ showAlert: true, alertText: "ERROR EN LA OBTENCION DE DATOS" });
    });
  }

  //Eliminar ejercicio
  eliminarEjercicio = (id) => {
    const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este ejercicio?");
    if (!confirmacion) return;

    axios.delete(`http://localhost:8080/Ejercicios/${id}`)
      .then(() => {
        this.setState({
          data: this.state.data.filter(item => item.id !== id),
        });
      })
      .catch(error => {
        console.error("Error al eliminar ejercicio:", error);
        this.setState({ showAlert: true, alertText: "Error al eliminar ejercicio" });
      });
  };

  render() {
    const { showAlert, alertText, autorizado, data } = this.state;
    const { navigate } = this.props;

    if (!autorizado) {
      return (
        <Container className="mt-5 text-center text-white">
          <h3>Verificando credenciales...</h3>
        </Container>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#1e1e2e", color: "#cdd6f4" }}>
        <nav style={{ background: "#12122a", borderBottom: "2px solid #3b3bff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "monospace", fontSize: "1.1rem", color: "#a0a0ff", fontWeight: "bold" }}>
             Bienvenido, Administrador
          </span>
        </nav>
        <h2 className="text-center mb-3">Crear, altas, bajas y cambios de ejercicios</h2>

        {showAlert && <Alert variant="danger">{alertText}</Alert>}

        <container>
          <Button variant="success" style={{ marginBottom: "12px" }}>
          <Link to="/chat" className="text-white" style={{ textDecoration: "none" }}>
            Crear nuevo ejercicio
          </Link>
        </Button>

        <Table striped bordered variant="dark">
          <thead>
            <tr>
              <th>Ejercicio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id || index}>
                  <td>{item.titulo || "Ejercicio sin título"}</td>
                  <td>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      style={{ marginRight: "8px" }}
                      onClick={() => navigate(`/ejercicio/${item.id}`)}
                    >
                      Ver
                    </Button>
                    <Button 
                      variant="warning" 
                      size="sm" 
                      style={{ marginRight: "8px" }}
                      onClick={() => navigate(`/ejercicio/${item.id}`)}
                    >
                      Modificar
                    </Button>
                    <Button 
                      onClick={() => this.eliminarEjercicio(item.id)} 
                      variant="danger" 
                      size="sm" 
                      style={{ marginRight: "8px" }}
                    >
                      Eliminar
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => navigate(`/probar/${item.id}`)}
                    >
                      Probar
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center text-muted py-3">
                  No hay ejercicios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        </container>
      </div>
    );
  }
}

export default AdministratorWrapper;