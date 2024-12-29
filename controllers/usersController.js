// usersController.js

/**
 * Registra un nuevo usuario.
 * @param {Object} req - Objeto de solicitud de Express con datos del usuario.
 * @param {Object} res - Objeto de respuesta de Express.
 */
async function registerUser(req, res) {
    try {
        const { correo, contraseña } = req.body;

        // Validar correo y contraseña
        if (!correo || !contraseña) {
            return res.status(400).json({ error: 'Correo y contraseña son obligatorios.' });
        }

        // Crear usuario en la base de datos
        const hashedPassword = await hashPassword(contraseña);
        const user = await createUser(correo, hashedPassword);

        res.status(201).json({ message: 'Usuario registrado con éxito.', user });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
}
