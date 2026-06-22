import React from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginStyle.css';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      condition: false,
      tipousuario: "",
      user: "",
      pass: "",
      loading: false,
      error: ""
    };
  }

  handleKeyPress = (e) => {
    if (e.key === "Enter") {
      this.validar();
    }
  };

  validar = () => {
    const { user, pass } = this.state;
    if (!user || !pass) {
      this.setState({ error: "Debes llenar todos los campos" });
      return;
    }

    this.setState({ loading: true, error: "" });

    axios.get("http://localhost:8080/Login", {
      params: {
        User: user,
        password: pass
      }
    })
      .then((response) => {
        const usuario = response.data;

        if (usuario.status === "yes") {
          localStorage.setItem("userRole", usuario.tipo);
          localStorage.setItem("isAuth", "true");

          if (usuario.tipo === "administrador") {
            window.location.href = "/administrator";
          }
        } else {
          window.location.href = "/no-autorizado";
        }
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error: "Error de conexión con el servidor" });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { condition, tipousuario, user, pass, loading, error } = this.state;

    if (condition && tipousuario === "administrador") {
      return <Navigate to="/administrator" />;
    }

    return (
      <div className="login-hero">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-12 col-lg-6 mb-5 mb-lg-0">
              <h1 className="login-hero-title">
                Tu asistente <br />
                <span>Python inteligente</span>
              </h1>
              <p className="login-hero-text">
                Organiza tareas, genera scripts y responde consultas técnicas en segundos.
                Inicia sesión para acceder a tu asistente y continuar tu flujo de trabajo.
              </p>
            </div>
            <div className="col-12 col-lg-5">
              <div className="login-form-card">
                <h4 className="fw-bold mb-2">Iniciar sesión</h4>
                <p className="login-form-subtitle mb-4">Ingresa tus credenciales para continuar</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control login-input"
                    id="loginUser"
                    placeholder="Usuario"
                    value={user}
                    autoFocus
                    onChange={(e) => this.setState({ user: e.target.value })}
                    onKeyPress={this.handleKeyPress}
                  />
                  <label htmlFor="loginUser">Usuario</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control login-input"
                    id="loginPass"
                    placeholder="Contraseña"
                    value={pass}
                    onChange={(e) => this.setState({ pass: e.target.value })}
                    onKeyPress={this.handleKeyPress}
                  />
                  <label htmlFor="loginPass">Contraseña</label>
                </div>

                <button
                  className="btn btn-primary w-100 login-submit"
                  onClick={this.validar}
                  disabled={loading}
                >
                  {loading ? "Validando..." : "Ingresar"}
                </button>

                <div className="text-center mt-3">
                  <span className="text-muted small">¿No tienes cuenta? </span>
                  <a href="/registro" className="small fw-bold text-decoration-none">
                    Regístrate aquí
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
