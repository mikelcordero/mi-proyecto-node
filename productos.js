const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Endpoint para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM producto');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Endpoint para agregar múltiples productos
router.post('/', async (req, res) => {
    const productos = req.body; // Esperar un array de productos en el cuerpo de la solicitud
    const valoresInsertados = [];

    try {
        for (const producto of productos) {
            const { nombre, precio } = producto;
            const result = await pool.query(
                'INSERT INTO producto (nombre, precio) VALUES ($1, $2) RETURNING *',
                [nombre, precio]
            );
            valoresInsertados.push(result.rows[0]);
        }
        res.status(201).json(valoresInsertados); // Devolver los productos insertados
    } catch (err) {
        console.error('Error al agregar productos:', err);
        res.status(500).json({ error: 'Error al agregar los productos' });
    }
});

// Endpoint para actualizar un producto con descripción y rating
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Obtener el ID del producto desde los parámetros
    const { descripcion, rating } = req.body; // Obtener los datos del cuerpo de la solicitud

    try {
        const result = await pool.query(
            'UPDATE producto SET descripcion = $1, rating = $2 WHERE id = $3 RETURNING *',
            [descripcion, rating, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(result.rows[0]); // Devolver el producto actualizado
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Endpoint para eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM producto WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente', producto: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

