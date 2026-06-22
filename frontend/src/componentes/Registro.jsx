import React from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './LoginStyle.css';

class Registro extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "",
      pass: "",
      confirmPass: "",
      loading: false,
      error: "",
      exito: ""
    };
  }

  registrar = () => {
    const { user, pass, confirmPass } = this.state;

    // Validaciones
    if (!user || !pass || !confirmPass) {
      this.setState({ error: "Debes llenar todos los campos" });
      return;
    }

    if (pass !== confirmPass) {
      this.setState({ error: "Las contraseñas no coinciden" });
      return;
    }

    this.setState({ loading: true, error: "", exito: "" });

    axios.post("http://localhost:8080/Registro", {
      username: user,
      password: pass
    })
      .then((response) => {
        const resultado = response.data;
        if (resultado.status === "ok") {
          this.setState({
            exito: "Usuario registrado correctamente. Redirigiendo al login...",
            user: "",
            pass: "",
            confirmPass: ""
          });
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          this.setState({ error: resultado.mensaje || "No se pudo registrar el usuario" });
        }
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.data && error.response.data.mensaje) {
          this.setState({ error: error.response.data.mensaje });
        } else {
          this.setState({ error: "Error de conexión con el servidor" });
        }
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { user, pass, confirmPass, loading, error, exito } = this.state;

    return (
      <div className="login-hero">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-12 col-lg-6 mb-5 mb-lg-0">
              <h1 className="login-hero-title">
                Crea tu <br />
                <span>cuenta gratuita</span>
              </h1>
              <p className="login-hero-text">
                Regístrate para comenzar a usar tu asistente Python inteligente
                y llevar tu productividad al siguiente nivel.
              </p>
            </div>
            <div className="col-12 col-lg-5">
              <div className="login-form-card">
                <h4 className="fw-bold mb-2">Crear cuenta</h4>
                <p className="login-form-subtitle mb-4">Completa los datos para registrarte</p>

                {error && <div className="alert alert-danger py-2">{error}</div>}
                {exito && <div className="alert alert-success py-2">{exito}</div>}

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control login-input"
                    id="regUser"
                    placeholder="Usuario"
                    value={user}
                    onChange={(e) => this.setState({ user: e.target.value, error: "" })}
                  />
                  <label htmlFor="regUser">Usuario</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control login-input"
                    id="regPass"
                    placeholder="Contraseña"
                    value={pass}
                    onChange={(e) => this.setState({ pass: e.target.value, error: "" })}
                  />
                  <label htmlFor="regPass">Contraseña</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control login-input"
                    id="regConfirmPass"
                    placeholder="Confirmar contraseña"
                    value={confirmPass}
                    onChange={(e) => this.setState({ confirmPass: e.target.value, error: "" })}
                  />
                  <label htmlFor="regConfirmPass">Confirmar contraseña</label>
                </div>

                <button
                  className="btn btn-primary w-100 login-submit mb-3"
                  onClick={this.registrar}
                  disabled={loading}
                >
                  {loading ? "Registrando..." : "Crear cuenta"}
                </button>

                <div className="text-center">
                  <span className="text-muted small">¿Ya tienes cuenta? </span>
                  <a href="/" className="small fw-bold text-decoration-none">
                    Inicia sesión
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

export default Registro;