const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, './')));

// CONEXIÓN INTEGRAL A MYSQL
// 1. Asegúrate de cambiar "createConnection" por "createPool"
// CONEXIÓN INTEGRAL A MYSQL
const db = mysql.createPool({
    // Lee dinámicamente las variables de Render, y si no hay, usa localhost
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || 'NTAGhTEyuOHkvWFliVQnTaKRFVxWpreM',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'railway',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==========================================
// CONTROL DE CREDENCIALES (AUTH)
// ==========================================
app.post('/api/auth/registrar', (req, res) => {
    const { nombre, email, password } = req.body;
    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, password], (err, result) => {
        if (err) {
            console.log("ERROR EN REGISTRO:", err); // <--- ESTO NOS VA A DECIR LA VERDAD EN LOS LOGS
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ usuarioId: result.insertId });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT id, nombre FROM usuarios WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.log("ERROR EN LOGIN:", err); // <--- ESTO TAMBIÉN
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) return res.status(401).json({ error: 'Usuario o clave inválidos.' });
        res.status(200).json({ usuario: results[0] });
    });
});

// ==========================================
// CONTROL DE MASCOTAS
// ==========================================
app.get('/api/mascotas/:usuario_id', (req, res) => {
    db.query('SELECT * FROM mascotas WHERE usuario_id = ?', [req.params.usuario_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.post('/api/mascotas', (req, res) => {
    const { usuario_id, nombre, raza, edad, peso } = req.body;
    db.query('INSERT INTO mascotas (usuario_id, nombre, raza, edad, peso) VALUES (?, ?, ?, ?, ?)', [usuario_id, nombre, raza, edad, peso], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, nombre, raza });
    });
});

// ==========================================
// CONTROL DE CITAS
// ==========================================
app.get('/api/citas/:mascota_id', (req, res) => {
    db.query('SELECT * FROM citas WHERE mascota_id = ? ORDER BY fecha ASC', [req.params.mascota_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.post('/api/citas', (req, res) => {
    const { mascota_id, titulo, fecha, hora, veterinario, motivo } = req.body;
    db.query('INSERT INTO citas (mascota_id, titulo, fecha, hora, veterinario, motivo) VALUES (?, ?, ?, ?, ?, ?)', [mascota_id, titulo, fecha, hora, veterinario, motivo], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Éxito' });
    });
});

// ==========================================
// CONTROL DE VACUNAS
// ==========================================
app.get('/api/vacunas/:mascota_id', (req, res) => {
    db.query('SELECT * FROM vacunas WHERE mascota_id = ? ORDER BY fecha_aplicacion DESC', [req.params.mascota_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.post('/api/vacunas', (req, res) => {
    const { mascota_id, nombre, estado, fecha_aplicacion, proxima_dosis } = req.body;
    db.query('INSERT INTO vacunas (mascota_id, nombre, estado, fecha_aplicacion, proxima_dosis) VALUES (?, ?, ?, ?, ?)', [mascota_id, nombre, estado, fecha_aplicacion, proxima_dosis], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Éxito' });
    });
});

// ==========================================
// CONTROL DE PASEOS
// ==========================================
app.get('/api/paseos/:mascota_id', (req, res) => {
    db.query('SELECT * FROM paseos WHERE mascota_id = ? ORDER BY fecha DESC', [req.params.mascota_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

app.post('/api/paseos', (req, res) => {
    const { mascota_id, fecha, hora, duracion, detalles } = req.body;
    db.query('INSERT INTO paseos (mascota_id, fecha, hora, duracion, detalles) VALUES (?, ?, ?, ?, ?)', [mascota_id, fecha, hora, duracion, detalles], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ mensaje: 'Éxito' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});