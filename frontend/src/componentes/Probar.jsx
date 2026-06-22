import React from "react";
import { Container, Button, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function ProbarWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <Probar id={id} navigate={navigate} />;
}

class Probar extends React.Component {
  state = {
    titulo: "",
    codigoReferencia: "",
    codigoUsuario: "",
    stdin: "",
    resultado: null,
    error: "",
    loading: true,
    ejecutando: false,
    tiempoInicio: null,
    tiempoTotal: null,
  };

  componentDidMount() {
    const { id } = this.props;
    axios.get(`http://localhost:8080/Ejercicios/${id}`)
      .then(response => {
        const codigoLimpio = (response.data.codigo || "")
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t");
        this.setState({
          titulo: response.data.titulo,
          codigoReferencia: response.data.codigo,
          codigoUsuario: response.data.codigo,
          loading: false,
          tiempoInicio: Date.now()
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error: "No se pudo cargar el ejercicio.", loading: false });
      });
  }

  ejecutarCodigo = () => {
    const { codigoUsuario, stdin, tiempoInicio } = this.state;

    if (!codigoUsuario.trim()) {
      this.setState({ error: "Escribe código antes de ejecutar." });
      return;
    }

    const codigoLimpio = codigoUsuario
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");

    this.setState({ ejecutando: true, resultado: null, error: "" });

    axios.post("http://localhost:8080/api/ejecutar", {
      codigo: codigoLimpio,
      stdin: stdin
    })
      .then(response => {
        const tiempoTotal = ((Date.now() - tiempoInicio) / 1000).toFixed(1);
        this.setState({
          resultado: response.data,
          ejecutando: false,
          tiempoTotal
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          error: "Error al ejecutar el código.",
          ejecutando: false
        });
      });
  };

  render() {
    const { titulo, codigoReferencia, codigoUsuario, stdin, resultado, error, loading, ejecutando, tiempoTotal } = this.state;
    const { navigate } = this.props;

    if (loading) {
      return (
        <Container className="mt-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-white">Cargando ejercicio...</p>
        </Container>
      );
    }

    // Estilos reutilizables
    const labelStyle = {
      fontFamily: "monospace",
      fontSize: "0.75rem",
      color: "#6c7086",
      marginBottom: "6px",
      textTransform: "uppercase",
      display: "block"
    };

    const editorBase = {
      fontFamily: "'Courier New', Courier, monospace",
      fontSize: "0.9rem",
      background: "#12122a",
      border: "1px solid #313244",
      borderRadius: "8px",
      padding: "16px",
      resize: "none",
      outline: "none",
      lineHeight: "1.6",
      width: "100%"
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#1e1e2e", color: "#cdd6f4" }}>

        {/* Navbar */}
        <nav style={{ background: "#12122a", borderBottom: "2px solid #3b3bff", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "monospace", fontSize: "1.1rem", color: "#a0a0ff", fontWeight: "bold" }}>
              Probar ejercicio
          </span>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {tiempoTotal && (
              <span style={{ fontFamily: "monospace", color: "#a6e3a1", fontSize: "0.9rem" }}>
                ⏱ Tiempo: {tiempoTotal}s
              </span>
            )}
            <Button variant="outline-secondary" size="sm" onClick={() => navigate("/administrator")}>
              ← Volver
            </Button>
          </div>
        </nav>

        {/* Título */}
        <div style={{ padding: "10px 24px", borderBottom: "1px solid #2a2a4a" }}>
          <span style={{ fontFamily: "monospace", color: "#89b4fa", fontSize: "0.95rem" }}>📄 {titulo}</span>
        </div>

        {/* Dos paneles principales */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Panel izquierdo — código de referencia */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", borderRight: "2px solid #2a2a4a", padding: "16px" }}>
            <label style={labelStyle}>📋 Código del ejercicio (referencia)</label>
            <textarea
              readOnly
              value={codigoReferencia}
              style={{ ...editorBase, flex: 1, color: "#cba6f7", opacity: 0.85 }}
            />
          </div>

          {/* Panel derecho — editor + stdin + resultado */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px", gap: "10px", overflowY: "auto" }}>

            {/* Editor del usuario */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "250px" }}>
              <label style={labelStyle}>✏️ Tu código — edítalo y ejecútalo</label>
              <textarea
                value={codigoUsuario}
                onChange={(e) => this.setState({ codigoUsuario: e.target.value })}
                spellCheck={false}
                style={{ ...editorBase, flex: 1, color: "#a8ff78", border: "1px solid #3b3bff" }}
              />
            </div>

            {/* Campo stdin */}
            <div>
              <label style={labelStyle}>
                📥 Inputs del programa (stdin)
                <span style={{ color: "#45475a", marginLeft: "8px", textTransform: "none", fontSize: "0.7rem" }}>
                  — escribe un valor por línea, en el orden que los pide el programa
                </span>
              </label>
              <textarea
                value={stdin}
                onChange={(e) => this.setState({ stdin: e.target.value })}
                placeholder={"Ej:\n3\n5\nhola"}
                rows={4}
                style={{
                  ...editorBase,
                  color: "#f9e2af",
                  border: "1px solid #f9e2af55",
                  resize: "vertical"
                }}
              />
            </div>

            {/* Botón ejecutar */}
            <Button
              onClick={this.ejecutarCodigo}
              disabled={ejecutando}
              style={{ background: "#3b3bff", border: "none", fontFamily: "monospace", fontWeight: "bold", padding: "10px" }}
            >
              {ejecutando
                ? <><Spinner animation="border" size="sm" /> Ejecutando...</>
                : "▶ Ejecutar código"}
            </Button>

            {/* Error de conexión */}
            {error && (
              <div style={{ background: "#3b1a1a", border: "1px solid #f38ba8", borderRadius: "8px", padding: "12px", fontFamily: "monospace", color: "#f38ba8", fontSize: "0.85rem" }}>
                ⚠️ {error}
              </div>
            )}

            {/* Resultado */}
            {resultado && (
              <div style={{ background: "#12122a", border: "1px solid #313244", borderRadius: "8px", padding: "16px" }}>

                {/* Encabezado con veredicto */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6c7086", textTransform: "uppercase" }}>
                    Resultado
                  </span>
                  <span style={{
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    color: resultado.stderr ? "#f38ba8" : "#a6e3a1",
                    background: resultado.stderr ? "#3b1a1a" : "#1a3b2a",
                    padding: "2px 14px",
                    borderRadius: "20px"
                  }}>
                    {resultado.stderr ? "❌ Falso" : "✅ Verdadero"}
                  </span>
                </div>

                {/* Salida estándar */}
                {resultado.stdout && (
                  <>
                    <p style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#6c7086", margin: "0 0 4px 0" }}>SALIDA:</p>
                    <pre style={{ color: "#a6e3a1", fontFamily: "monospace", fontSize: "0.85rem", margin: "0 0 10px 0", whiteSpace: "pre-wrap", background: "#0d0d1a", padding: "10px", borderRadius: "6px" }}>
                      {resultado.stdout}
                    </pre>
                  </>
                )}

                {/* Error del código */}
                {resultado.stderr && (
                  <>
                    <p style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#6c7086", margin: "0 0 4px 0" }}>ERROR:</p>
                    <pre style={{ color: "#f38ba8", fontFamily: "monospace", fontSize: "0.85rem", margin: 0, whiteSpace: "pre-wrap", background: "#0d0d1a", padding: "10px", borderRadius: "6px" }}>
                      {resultado.stderr}
                    </pre>
                  </>
                )}

                {/* Tiempo */}
                {tiempoTotal && (
                  <p style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#6c7086", margin: "10px 0 0 0" }}>
                    ⏱ Tiempo total: {tiempoTotal}s
                  </p>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }
}

export default ProbarWrapper;