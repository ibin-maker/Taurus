import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './ChatStyle.css';

function ChatWrapper(){
  const navigate = useNavigate();
  return <Chat navigate={navigate}/>
}

class Chat extends React.Component {
  state = {
    messages: [
      { id: 1, content: "Hola, ¿en qué puedo ayudarte?", isUser: false }
    ],
    inputValue: "",
    isThinking: false,
    darkMode: false,
    showNotification: false,
    notificationText: "",
  };

  chatContainerRef = React.createRef();
  notificationTimeout = null;

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
  }

  scrollToBottom = () => {
    if (this.chatContainerRef.current) {
      this.chatContainerRef.current.scrollTop = this.chatContainerRef.current.scrollHeight;
    }
  };

  showNotification = (text) => {
    if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
    this.setState({ showNotification: true, notificationText: text });
    this.notificationTimeout = setTimeout(() => {
      this.setState({ showNotification: false });
    }, 3000);
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  };

  sendMessage = () => {
    const { inputValue, messages } = this.state;
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage = { id: Date.now(), content: trimmed, isUser: true };
    this.setState({ messages: [...messages, userMessage], inputValue: "", isThinking: true });

    axios.post("http://localhost:8080/api/generar", { prompt: trimmed })
      .then(response => {
        const aiMessage = {
          id: Date.now() + 1,
          content: response.data.respuesta,
          isUser: false
        };
        this.setState(prev => ({
          messages: [...prev.messages, aiMessage],
          isThinking: false
        }));
      })
      .catch(error => {
        console.error(error);
        const errorMessage = {
          id: Date.now() + 1,
          content: "Error al conectar con la IA. Intenta de nuevo.",
          isUser: false
        };
        this.setState(prev => ({
          messages: [...prev.messages, errorMessage],
          isThinking: false
        }));
      });
  };

  extraerCodigo = (content) => {
    if (!content) return "";
    const codeRegex = /```(?:\w+)?\n([\s\S]*?)```/g;
    const bloques = [];
    let match;
    while ((match = codeRegex.exec(content)) !== null) {
      const codigoLimpio = match[1]
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .trim();
      bloques.push(codigoLimpio);
    }
    return bloques.join("\n\n");
  };

  guardarEjercicio = (content) => {
    const codigo = this.extraerCodigo(content);
    if (!codigo) {
      this.showNotification("No se encontró código para guardar.");
      return;
    }

    const titulo = `Ejercicio ${new Date().toLocaleString("es-MX")}`;
    const usuarioId = localStorage.getItem("userId") || 1; // Reemplazar con lógica real de usuario

    axios.post("http://localhost:8080/Ejercicios", {
      titulo,
      codigo,
      usuarioId: usuarioId
    })
      .then(() => {
        this.showNotification("Ejercicio guardado exitosamente!");
      })
      .catch(error => {
        console.error(error);
        this.showNotification("Error al guardar ejercicio.");
      });
    };

  clearChat = () => {
    this.setState({ messages: [], isThinking: false });
  };

  clearInput = () => {
    this.setState({ inputValue: "" });
  };

  copyFullChat = () => {
    const { messages } = this.state;
    const chatText = messages
      .map(msg => `${msg.isUser ? "User" : "System"}: ${msg.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(chatText)
      .then(() => this.showNotification("Chat copiado al portapapeles!"))
      .catch(err => console.error("No se pudo copiar:", err));
  };

  copyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => this.showNotification("Código copiado al portapapeles!"))
      .catch(err => console.error("No se pudo copiar:", err));
  };

  toggleDarkMode = () => {
    this.setState(prev => ({ darkMode: !prev.darkMode }));
  };

  renderMessageContent = (content, isUser) => {
    const codeRegex = /```(\w+)?\s*([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = codeRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++}>{content.slice(lastIndex, match.index)}</span>
        );
      }
      
      const codigoLimpio = match[2].trim();

      parts.push(
        <div key={key++} style = {{ position: "relative" }}>
          <button
            className="copy-button"
            aria-label="Copiar código"
            onClick={() => this.copyCode(codigoLimpio)}
            style={{ position: "absolute", top: "8px", right: "8px" }}>
            📋
          </button>
          {!isUser && (
              <button
                className="copy-button"
                aria-label="Guardar ejercicio"
                onClick={() => this.guardarEjercicio(content)}
                title="Guardar como ejercicio"
                style={{ background: "#198754", color: "white", border: "none", borderRadius: "4px", padding: "2px 8px", cursor: "pointer" }}
              >
                💾 Guardar
              </button>
            )}
          <pre key={key++}>
            <code className={match[1] ? `language-${match[1]}` : ""}>
              {match[2].trim()}
            </code>
          </pre>
        </div>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(<span key={key++}>{content.slice(lastIndex)}</span>);
    }

    return parts;
  };

  render() {
    const { messages, inputValue, isThinking, darkMode, showNotification, notificationText } = this.state;

    return (
      <div className={darkMode ? "dark-mode" : ""} style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* Notification Bar */}
        {showNotification && (
          <div className="notification-bar">{notificationText}</div>
        )}

        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <Container>
            <span className="navbar-brand">Chat</span>
            <div className="ms-auto">
              <button className="btn btn-outline-light me-2" onClick={this.copyFullChat}>
                Copiar Chat
              </button>
              <button className="btn btn-outline-light me-2" onClick={this.clearChat}>
                Limpiar Chat
              </button>
              <button className="btn btn-outline-light me-2" onClick={this.toggleDarkMode}>
                {darkMode ? "☀️" : "🌙"}
              </button>
              <Button variant="btn btn-outline-light" onClick={() => this.props.navigate("/administrator")}>
                ← Volver
              </Button>
            </div>
          </Container>
        </nav>

        {/* Chat Messages */}
        <Container className="d-flex flex-column flex-grow-1" style={{ overflow: "hidden" }}>
          <div className="chat-container" ref={this.chatContainerRef}>

            {messages.map(msg => (
              <div key={msg.id} className={`message-group ${msg.isUser ? "user-group" : "system-group"}`}>
                <div className="message-label">{msg.isUser ? "User" : "System"}</div>
                <div className={`chat-message ${msg.isUser ? "user-message" : "system-message"}`}>
                  {this.renderMessageContent(msg.content, msg.isUser)}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="message-group system-group">
                <div className="message-label">System</div>
                <div className="chat-message system-message">
                  <div className="thinking"></div>
                  Pensando...
                </div>
              </div>
            )}

          </div>
        </Container>

        {/* Input Area */}
        <div className="input-container">
          <Container>
            <div className="input-group">
              <textarea
                className="form-control chat-input"
                placeholder="Escribe tu mensaje aquí..."
                aria-label="Chat input"
                value={inputValue}
                onChange={this.handleInputChange}
                onKeyPress={this.handleKeyPress}
                autoFocus
              />
              <button className="btn btn-primary" type="button" onClick={this.sendMessage}>
                Enviar
              </button>
              <button className="btn btn-secondary" type="button" onClick={this.clearInput}>
                Limpiar
              </button>
            </div>
          </Container>
        </div>

      </div>
    );
  }
}

export default ChatWrapper;