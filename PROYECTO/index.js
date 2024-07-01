const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;
const ip = 'localhost';

// Middleware para analizar cuerpos de solicitud
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuración de la conexión a MySQL
const conexion = mysql.createConnection({
    host: "elzoly.cnecua6ci4fi.us-east-1.rds.amazonaws.com",
    port: 3306,
    database: "Lorenzo",
    user: "lorenzo",
    password: "72517577"
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos.');
});

// Ruta POST para agregar usuarios
app.post('/users', (req, res) => {
    const { name, lastname, email, dni, phone, address, birthdate, role } = req.body;

    const query = 'INSERT INTO usuario (name, lastname, email, dni, phone, address, birthdate, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    conexion.query(query, [name, lastname, email, dni, phone, address, birthdate, role], (err, result) => {
        if (err) {
            console.error('Error al insertar datos de usuario:', err);
            res.status(500).send('Ocurrió un error al procesar tu solicitud.');
            return;
        }

        console.log('Usuario insertado correctamente.');
        res.status(200).send('Tu respuesta se ha enviado correctamente.');
    });
});

// Ruta GET para obtener usuarios y mostrar en la tabla
app.get('/users', (req, res) => {
    const query = 'SELECT * FROM usuario';

    conexion.query(query, (err, rows) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).send('Error al obtener usuarios.');
            return;
        }

        res.status(200).json(rows);
    });
});

// Ruta GET para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            console.error('Error al enviar index.html:', err);
            res.status(500).send('Error interno del servidor.');
        } else {
            console.log('Se ha enviado index.html correctamente.');
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${ip}:${PORT}`);
});
