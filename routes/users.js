const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Endpoint para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
        // Verificar si el correo ya existe
        const checkUserQuery = 'SELECT * FROM usuario WHERE correo = $1';
        const checkUserResult = await pool.query(checkUserQuery, [correo]);

        if (checkUserResult.rows.length > 0) {
            return res.status(400).json({ error: 'Correo ya registrado' });
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

        // Insertar el nuevo usuario
        const insertUserQuery = 'INSERT INTO usuario (correo, contraseña) VALUES ($1, $2) RETURNING *';
        const result = await pool.query(insertUserQuery, [correo, hashedPassword]);

        const newUser = result.rows[0];

        // Responder con el nuevo usuario (sin la contraseña)
        res.status(201).json({
            id: newUser.id,
            correo: newUser.correo
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Endpoint para iniciar sesión
router.post('/login', async (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    try {
        // Verificar si el correo existe
        const query = 'SELECT * FROM usuario WHERE correo = $1';
        const result = await pool.query(query, [correo]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        const user = result.rows[0];

        // Comparar la contraseña con la almacenada (encriptada)
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);

        if (!isMatch) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos' });
        }

        // Crear JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

module.exports = router;
