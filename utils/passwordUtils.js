// utils/passwordUtils.js

/**
 * Valida la fortaleza de una contraseña.
 * Debe tener al menos 8 caracteres, incluyendo letras, números y un carácter especial.
 * @param {string} password - Contraseña a validar.
 * @returns {boolean} - Verdadero si es segura, falso si no.
 */
function isPasswordSecure(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

module.exports = { isPasswordSecure };
