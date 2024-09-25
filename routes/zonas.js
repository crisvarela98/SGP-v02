const express = require('express');
const router = express.Router();
const Cliente = require('../models/clientes');

// Ruta para obtener todas las zonas únicas
router.get('/', async (req, res) => {
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
