const express = require('express');
const cors = require('cors');
const app = express();
const productosRouter = require('./productos');
const usersRouter = require('./users');
require('dotenv').config();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
app.use(cors());

// Rutas
app.use('/productos', productosRouter);
app.use('/api/usuario', usersRouter);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Ocurrió un error en el servidor' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
