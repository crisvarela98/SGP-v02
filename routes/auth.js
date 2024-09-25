const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuarios');

// Ruta de autenticación
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos
        const usuario = await Usuario.findOne({ username });

        // Verificar si el usuario existe y si la contraseña es correcta
        if (usuario && usuario.password === password) {
            res.json({ success: true, message: 'Autenticación exitosa' });
        } else {
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        res.status(500).send('Error en el servidor al autenticar usuario');
    }
});

module.exports = router;
