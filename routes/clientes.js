const express = require('express');
const router = express.Router();
const Cliente = require('../models/clientes');

// Obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);  // Enviar los clientes como respuesta JSON
    } catch (error) {
        res.status(500).send('Error al obtener los clientes');
    }
});

// Ruta para obtener todas las zonas únicas
router.get('/zonas', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        const zonasUnicas = [...new Set(clientes.map(cliente => cliente.zone))];
        res.json(zonasUnicas);
    } catch (error) {
        console.error('Error al obtener las zonas:', error);
        res.status(500).send('Error al obtener las zonas');
    }
});

module.exports = router;
