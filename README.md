# 🐍 TAURUS - Asistente de Codificación Python con IA

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=nodedotjs)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql)](https://mysql.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?logo=bootstrap)](https://getbootstrap.com/)

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Objetivos](#objetivos)
- [Requisitos Funcionales](#requisitos-funcionales)
- [Reglas de Negocio](#reglas-de-negocio)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Modelo de Datos](#modelo-de-datos)
- [Casos de Prueba](#casos-de-prueba)
- [Historias de Usuario](#historias-de-usuario)
- [Stakeholders](#stakeholders)
- [Instalación](#instalación)
- [Endpoints API](#endpoints-api)
- [Seguridad](#seguridad)
- [Contribución](#contribución)
- [Equipo](#equipo)

---

## 🚀 Descripción del Proyecto

**TAURUS** es una plataforma web educativa e interactiva que permite a los usuarios aprender, practicar y desarrollar código Python directamente desde el navegador, sin necesidad de instalar nada localmente.

### ✨ Características Principales

- ✍️ **Editor de código en línea** con ejecución segura
- 📚 **Catálogo de ejercicios** por niveles
- 🤖 **Asistente inteligente** para detectar errores y sugerir correcciones
- 💾 **Guardado de proyectos personales**
- 📊 **Seguimiento de progreso** individual
- 🔒 **Seguridad por diseño** con sanitización de entradas
- 📈 **Escalable** para cientos de usuarios concurrentes

### 🎯 Metáfora del Elevador

> *"Para estudiantes y programadores que quieren aprender Python sin complicaciones, que necesitan un entorno práctico con retroalimentación inmediata y asistencia inteligente, TAURUS es una plataforma web educativa que permite escribir instrucciones en español, generar y optimizar código Python, y recibir corrección de errores al instante."*

---

## 🎯 Objetivos

### Generales

- Proporcionar una plataforma accesible y segura para aprender Python desde el navegador
- Integrar un asistente con IA que genere, optimice y corrija código en español
- Mantener un rendimiento rápido y escalable para múltiples usuarios concurrentes

### Específicos

| # | Objetivo | Detalle |
|---|----------|---------|
| 1 | Entorno de ejecución Python 100% funcional | Sin configuración local, seguro y con límites de recursos (sandbox) |
| 2 | Aprendizaje práctico con ejercicios validados | Corrección inmediata y sugerencias para mejorar |
| 3 | Reducción de frustración inicial | Detección de errores comunes con explicaciones claras en español |
| 4 | Seguimiento de progreso individual | Historial, puntuación, insignias y recomendación personalizada |
| 5 | Rendimiento y disponibilidad | <2s en interfaz, <3s en ejecución, 99.5% disponibilidad |
| 6 | Seguridad por diseño | Protección contra código malicioso y datos de usuarios |
| 7 | Escalabilidad | Cientos de usuarios concurrentes sin rediseños profundos |
| 8 | Promover buenas prácticas | PEP 8, comparador de soluciones y documentación integrada |

---

## 📋 Requisitos Funcionales

| ID | Requerimiento | Métrica de Validación |
|----|---------------|----------------------|
| **RF1** | Registro e inicio de sesión | Autenticación exitosa/fallida con pruebas de credenciales |
| **RF2** | Memoria contextual de la IA | Conversación de al menos 3 turnos dependientes del contexto |
| **RF3** | Entrada de instrucciones en español | Prompts como "Genera una función que sume dos números" |
| **RF4** | Generación de código Python funcional | Código ejecutable sin errores sintácticos graves |
| **RF5** | Descarga o copia del código | Formato .py o portapapeles con un clic |
| **RF6** | Optimización de código existente | Métricas de tiempo de ejecución o complejidad ciclomática |
| **RF7** | Corrección de errores en código | Casos de error conocidos (variable no definida, indentación) |

### ⚠️ Restricciones

| ID | Restricción |
|----|-------------|
| **RX1** | El código generado NO se ejecutará en el servidor backend |
| **RX2** | Tamaño de prompts limitado por la IA utilizada |
| **RX3** | Desarrollo completado dentro del calendario escolar (semestre actual) |

---

## 📜 Reglas de Negocio

<details>
<summary><b>RNE-01: Autenticación y Sesión</b> (haz clic para expandir)</summary>

- **RNE-01.1** Solo usuarios autenticados pueden acceder al asistente
- **RNE-01.2** Sesiones expiran después de 30 minutos de inactividad
- **RNE-01.3** Registro: email válido + contraseña (mínimo 8 caracteres, 1 mayúscula, 1 número)
</details>

<details>
<summary><b>RNE-02: Gestión de Prompts</b></summary>

- **RNE-02.1** Cada prompt debe tener lenguaje definido (Python) y descripción clara
- **RNE-02.2** El asistente solo genera respuestas relacionadas con Python
- **RNE-02.3** Si no es sobre Python: *"Este asistente solo ayuda con Python"*
</details>

<details>
<summary><b>RNE-03: Historial de Conversaciones</b></summary>

- **RNE-03.1** Se guarda automáticamente cada prompt y su respuesta
- **RNE-03.2** El usuario puede ver, buscar y eliminar su historial
- **RNE-03.3** Historial ordenado por fecha descendente (más reciente primero)
</details>

<details>
<summary><b>RNE-04: Generación de Código</b></summary>

- **RNE-04.1** Código válido para Python 3.8+
- **RNE-04.2** Si no puede generar código seguro, mostrar advertencia
- **RNE-04.3** Botón "Copiar" para copiar el código al portapapeles
</details>

<details>
<summary><b>RNE-05: Límites de Uso</b></summary>

- **RNE-05.1** Gratuitos: máximo 50 prompts por día
- **RNE-05.2** Premium: máximo 500 prompts por día
- **RNE-05.3** Bloqueo al exceder el límite hasta el día siguiente
</details>

<details>
<summary><b>RNE-06: Persistencia (MySQL + Sequelize)</b></summary>

- **RNE-06.1** Modelos mínimos: `User`, `Prompt`, `Response`, `UserLimit`
- **RNE-06.2** Toda interacción a través de Sequelize (evitar SQL directo)
- **RNE-06.3** Contraseñas hasheadas con bcrypt
</details>

<details>
<summary><b>RNE-07: Frontend (React + Bootstrap)</b></summary>

- **RNE-07.1** Interfaz responsive (Bootstrap grid system)
- **RNE-07.2** Área de prompt: campo de texto + botón "Enviar"
- **RNE-07.3** Resultado en bloque con syntax highlighting
- **RNE-07.4** Sección "Historial" visible
</details>

<details>
<summary><b>RNE-08: Backend (Node.js + Express)</b></summary>

- **RNE-08.1** Todos los endpoints responden en JSON
- **RNE-08.2** Endpoints requeridos: `POST /api/auth/login`, `POST /api/auth/register`, `POST /api/prompt`, `GET /api/history`, `DELETE /api/history/:id`
- **RNE-08.3** Errores con códigos HTTP adecuados (400, 401, 403, 500)
</details>

<details>
<summary><b>RNE-09: Integración con IA</b></summary>

- **RNE-09.1** Conexión vía API externa (OpenAI o modelo open source)
- **RNE-09.2** 2 reintentos si falla; si persiste, error controlado
- **RNE-09.3** Pre-prompt del sistema: *"Eres un asistente experto en Python. Responde solo con código y breves explicaciones."*
</details>

<details>
<summary><b>RNE-10: Seguridad</b></summary>

- **RNE-10.1** Sanitizar todo prompt antes de enviarlo a la IA
- **RNE-10.2** No mostrar errores internos del servidor al cliente
- **RNE-10.3** Usar variables de entorno para claves API y credenciales de BD
</details>

---

## 🏗️ Arquitectura

### Flujo de la Aplicación

```mermaid
flowchart TD
    A[Usuario abre aplicación web] --> B[Sistema carga pantalla de login/registro]
    B --> C[Usuario ingresa credenciales y autentica]
    C --> D[Sistema valida usuario y genera token JWT]
    D --> E[Sistema verifica límite diario de prompts en MySQL]
    E --> F[Usuario escribe prompt sobre Python]
    F --> G[Frontend valida que prompt no esté vacío]
    G --> H[Sistema envía prompt a backend Express vía POST /api/prompt]
    H --> I[Backend sanitiza prompt]
    I --> J[Backend prepara pre-prompt del sistema]
    J --> K[Backend envía prompt + pre-prompt a API de IA]
    K --> L[IA genera respuesta - código Python + explicación]
    L --> M[Backend guarda prompt y respuesta en MySQL usando Sequelize]
    M --> N[Backend responde al frontend con JSON]
    N --> O[Frontend muestra respuesta con syntax highlighting]
    O --> P[Usuario copia el código con botón Copiar]
    P --> Q[Usuario puede ver su historial en panel lateral]
