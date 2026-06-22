import React from "react";
import { Container, Button, Alert, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

// Wrapper para inyectar params y navigate en componente de clase
function EjercicioWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <Ejercicio id={id} navigate={navigate} />;
}

class Ejercicio extends React.Component {
  state = {
    titulo: "",
    codigo: "",
    codigoOriginal: "",
    loading: true,
    guardando: false,
    error: "",
    exito: ""
  };

  componentDidMount() {
    const { id } = this.props;
    axios.get(`http://localhost:8080/Ejercicios/${id}`)
      .then(response => {
        this.setState({
          titulo: response.data.titulo,
          codigo: response.data.codigo,
          codigoOriginal: response.data.codigo,
          loading: false
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error: "No se pudo cargar el ejercicio.", loading: false });
      });
  }

  handleCodigoChange = (e) => {
    this.setState({ codigo: e.target.value, exito: "", error: "" });
  };

  guardarCambios = () => {
    const { id } = this.props;
    const { codigo, titulo } = this.state;

    this.setState({ guardando: true, exito: "", error: "" });

    axios.put(`http://localhost:8080/Ejercicios/${id}`, { titulo, codigo })
      .then(() => {
        this.setState({
          codigoOriginal: codigo,
          guardando: false,
          exito: "Cambios guardados correctamente."
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ guardando: false, error: "Error al guardar los cambios." });
      });
  };

  resetearCodigo = () => {
    this.setState({ codigo: this.state.codigoOriginal, exito: "", error: "" });
  };

  render() {
    const { titulo, codigo, loading, guardando, error, exito } = this.state;
    const { navigate } = this.props;

    if (loading) {
      return (
        <Container className="mt-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando ejercicio...</p>
        </Container>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#1e1e2e" }}>

        {/* Navbar */}
        <nav className="navbar navbar-dark" style={{ background: "#12122a", borderBottom: "2px solid #3b3bff" }}>
          <Container>
            <span className="navbar-brand fw-bold" style={{ color: "#a0a0ff", fontFamily: "monospace", fontSize: "1.1rem" }}>
                Editor de Ejercicio
            </span>
            <div className="ms-auto d-flex gap-2">
              <Button
                variant="outline-light"
                size="sm"
                onClick={this.resetearCodigo}
              >
                Restablecer
              </Button>
              <Button
                variant="success"
                size="sm"
                onClick={this.guardarCambios}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "💾 Guardar cambios"}
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => navigate("/administrator")}
              >
                ← Volver
              </Button>
            </div>
          </Container>
        </nav>

        <Container className="mt-4 flex-grow-1 d-flex flex-column" style={{ maxWidth: "900px" }}>

          {/* Título */}
          <h5 style={{ color: "#a0a0ff", fontFamily: "monospace", marginBottom: "16px" }}>
            📄 {titulo}
          </h5>

          {error && <Alert variant="danger">{error}</Alert>}
          {exito && <Alert variant="success">{exito}</Alert>}

          {/* Editor de código */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <label style={{ color: "#888", fontSize: "0.8rem", fontFamily: "monospace", marginBottom: "6px" }}>
              CÓDIGO PYTHON — puedes editarlo y agregar comentarios
            </label>
            <textarea
              value={codigo}
              onChange={this.handleCodigoChange}
              spellCheck={false}
              style={{
                flex: 1,
                minHeight: "500px",
                width: "100%",
                background: "#12122a",
                color: "#a8ff78",
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "0.95rem",
                border: "1px solid #3b3bff",
                borderRadius: "8px",
                padding: "20px",
                resize: "vertical",
                outline: "none",
                lineHeight: "1.6"
              }}
            />
          </div>

          {/* Info de atajos */}
          <p style={{ color: "#555", fontSize: "0.75rem", fontFamily: "monospace", marginTop: "10px", marginBottom: "20px" }}>
            💡 Tip: agrega comentarios con # para anotar tus observaciones en el código.
          </p>

        </Container>
      </div>
    );
  }
}

export default EjercicioWrapper;