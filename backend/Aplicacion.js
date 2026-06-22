require('dotenv').config();
const express = require("express");
const path = require('path');
const app = express();
const puerto = 8080;
const { sequelize, User, Role, Preguntas } = require("./models");
const cors = require("cors");
const axios = require('axios');


const OpenAI = require('openai');
const { stdout } = require('process');
const ai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

let modeloGratis = "deepseek/deepseek-chat";

async function obtenerModeloGratis() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/models", {
            headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` }
        });
        const data = await response.json();

        // Filtra modelos cuyo precio de prompt sea 0
        const gratis = data.data.filter(m => 
            m.pricing && parseFloat(m.pricing.prompt) === 0
        );

        if (gratis.length > 0) {
            modeloGratis = gratis[0].id;
            console.log("Modelo gratuito seleccionado:", modeloGratis);
        } else {
            console.log("No se encontraron modelos gratuitos, usando fallback:", modeloGratis);
        }
    } catch (error) {
        console.error("Error al obtener modelos:", error);
    }
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.get("/Login", async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader('Cache-control', 'no-cache');
    console.log("METODO GET Y LOGIN");

    const user = request.query.User;
    const password = request.query.password;

    try {
        const usuario = await User.findOne({
            where: { username: user, password },
            include: [{ model: Role, attributes: ["name"] }]
        });

        if (usuario) {
            const tipousuario = usuario.Role ? usuario.Role.name : "nodefinido";
            const respuesta = { status: "yes", tipo: tipousuario };
            console.log(JSON.stringify(respuesta));
            return response.json(respuesta);
        }

        const respuesta = { status: "no", tipo: "nodefinido" };
        console.log(JSON.stringify(respuesta));
        return response.json(respuesta);
    } catch (err) {
        console.error("Error en login:", err);
        return response.status(500).json({ status: "no", tipo: "nodefinido" });
    }
});

app.post("/Registro", async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader('Cache-control', 'no-cache');
    const { username , password } = request.body;

    if(!username || !password) {
        return response.status(400).json({ status: "no", tipo: "nodefinido", error: "Faltan campos" });
    }

    try{
      const usuarioExiste = await User.findOne({ where: { username } });
      if(usuarioExiste) {
        return response.status(409).json({status: "error", mensaje: "El usuario ya existe"});
    }

    const rolUsuario = await Role.findOne({ where: { name: "usuario" } });
    const rolId = rolUsuario ? rolUsuario.id : null;

    await User.create({ username, password, roleId: rolId });

    console.log(`Nuevo usuario registrado: ${username}`);
    return response.status(201).json({ status: "ok", mensaje: "Usuario registrado correctamente" });

  }catch(err) {
    console.error("Error al registrar usuario:", err);
    return response.status(500).json({ status: "error", mensaje: "No se pudo registrar el usuario" });
  }
});

app.post("/chat", async (req, res) => {
    const { prompt, messages } = req.body;

    const mensajes = messages || [{role: "user", content: prompt}];

    if (!mensajes.length) {
        return res.status(400).json({ error: "El prompt es requerido" });
    }

    try {
        const completion = await ai.chat.completions.create({
            model: modeloGratis,
            messages: mensajes,
        });

        const respuesta = completion.choices[0].message.content;
        return res.json({ respuesta });

    } catch (error) {
        console.error("Error al conectar con DeepSeek:", error);
        return res.status(500).json({ error: "Fallo al generar contenido con la IA" });
    }
});

app.post("/api/generar", async (req, res) => {
    const { prompt, messages } = req.body;
    const mensajes = messages || [{role: "user", content: prompt}];

    if (!prompt) {
        return res.status(400).json({ error: "El prompt es requerido" });
    }

    try {
        const completion = await ai.chat.completions.create({
            model: modeloGratis, 
            messages: mensajes
        });

        const respuesta = completion.choices[0].message.content;
        return res.json({ respuesta });

    } catch (error) {
        console.error("Error al conectar con DeepSeek:", error);
        return res.status(500).json({ error: "Fallo al generar contenido con la IA" });
    }
});

// Obtener todos los ejercicios
app.get("/Ejercicios", async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader('Cache-control', 'no-cache');
    try {
      const ejercicios = await Preguntas.findAll();
      const resultado = ejercicios.map(e => ({
        id: e.id,
        titulo: e.titulo,
        codigo: e.codigo
      }));
      return response.json(resultado);
    } catch (err) {
      console.error("Error al obtener ejercicios", err);
      return response.status(500).json({ error: "No se pudieron cargar los ejercicios" });
    }
});

// Obtener ejercicio por ID
app.get("/Ejercicios/:id", async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = request.params;
    try {
        const ejercicio = await Preguntas.findByPk(id);
        if (!ejercicio) {
            return response.status(404).json({ error: "Ejercicio no encontrado" });
        }
        return response.json({ id: ejercicio.id, titulo: ejercicio.titulo, codigo: ejercicio.codigo });
    } catch (err) {
        console.error("Error al obtener ejercicio:", err);
        return response.status(500).json({ error: "No se pudo cargar el ejercicio" });
    }
});

// EJERCICIOS: crear
app.post("/Ejercicios", async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const { titulo, codigo, usuario_id } = request.body;
    if (!titulo || !codigo) {
        return response.status(400).json({ error: "Título y código son requeridos" });
    }
    try {
        const nuevo = await Preguntas.create({ titulo, codigo, usuarioId: usuario_id || 1 });
        return response.status(201).json({ status: "ok", id: nuevo.id });
    } catch (err) {
        console.error("Error al guardar ejercicio:", err);
        return response.status(500).json({ error: "No se pudo guardar el ejercicio" });
    }
});

// EJERCICIOS: actualizar
app.put("/Ejercicios/:id", async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = request.params;
    const { titulo, codigo } = request.body;
    try {
        const ejercicio = await Preguntas.findByPk(id);
        if (!ejercicio) {
            return response.status(404).json({ error: "Ejercicio no encontrado" });
        }
        await ejercicio.update({ titulo, codigo });
        return response.json({ status: "ok", mensaje: "Ejercicio actualizado" });
    } catch (err) {
        console.error("Error al actualizar ejercicio:", err);
        return response.status(500).json({ error: "No se pudo actualizar el ejercicio" });
    }
});

// EJERCICIOS: eliminar
app.delete("/Ejercicios/:id", async (request, response) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    const { id } = request.params;
    try {
        const ejercicio = await Preguntas.findByPk(id);
        if (!ejercicio) {
            return response.status(404).json({ error: "Ejercicio no encontrado" });
        }
        await ejercicio.destroy();
        return response.json({ status: "ok", mensaje: "Ejercicio eliminado" });
    } catch (err) {
        console.error("Error al eliminar ejercicio:", err);
        return response.status(500).json({ error: "No se pudo eliminar el ejercicio" });
    }
});

//Ejecutar codigo con Judge0
app.post("/api/ejecutar", async (req, res) => {
    const { codigo: codigoRaw, stdin } = req.body;

    if (!codigoRaw) {
        return res.status(400).json({ error: "El código es requerido" });
    }

    const codigo = codigoRaw.replace(/\\n/g, "\n").replace(/\\t/g, "\t");

    console.log("Código recibido:", JSON.stringify(codigo)); 
    console.log("Longitud:", codigo ? codigo.length : 0);  

    try {
      const submitResponse = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        { 
          source_code: codigo, 
          language_id: 71, 
          stdin: stdin || ""
        },
        {
          headers:{
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
          }
        }
      );

      const resultado = submitResponse.data;

      return res.json({
        stdout: resultado.stdout || "",
        stderr: resultado.stderr || resultado.compile_output || "",
        status: resultado.status ? resultado.status.description: "Unknown",
        tiempo: resultado.time,
        memoria: resultado.memory
      });
    } catch (error){
      console.error("Error al ejecutar con Judge0: ", error.response?.data || error.message);
      return res.status(500).json({error: "No se pudo ejecutar el código"});
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

sequelize.authenticate()
  .then(() => sequelize.sync())
  .then(async () => {
    console.log("DB lista");
    await obtenerModeloGratis();
    app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
  })
  .catch((err) => {
    console.error("Error al iniciar DB:", err);
    process.exit(1);
  });