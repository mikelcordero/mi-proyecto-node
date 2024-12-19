const express = require('express');
const app = express();
const productosRouter = require('./productos');
const usersRouter = require('./users');
require('dotenv').config();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/productos', productosRouter);
app.use('/api/usuario', usersRouter);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
