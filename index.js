// index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productosRouter = require('./routes/productos');
const usersRouter = require('./routes/users');
const errorHandler = require('./middlewares/errorMiddleware');

dotenv.config(); // Cargar variables de entorno
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Rutas
app.use('/productos', productosRouter); // CRUD de productos
app.use('/api/usuario', usersRouter); // CRUD de usuarios y autenticación

// Middleware para manejo de errores
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
