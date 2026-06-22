DROP DATABASE IF EXISTS usuarios;
CREATE DATABASE IF NOT EXISTS usuarios;
USE usuarios;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role_id INT NOT NULL,
  CONSTRAINT fk_usuarios_roles
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  codigo LONGTEXT,
  usuario_id INT NOT NULL,
  CONSTRAINT fk_preguntas_usuarios
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT IGNORE INTO roles (name) VALUES ('administrador'), ('usuario');

INSERT IGNORE INTO usuarios (username, password, role_id) VALUES 
('admin', '1234', (SELECT id FROM roles WHERE name = 'administrador'));
