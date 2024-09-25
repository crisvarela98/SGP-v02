const express = require('express');
const router = express.Router();
const Nota = require('../models/notas');

// Obtener todas las notas
router.get('/', async (req, res) => {
    try {
        const notas = await Nota.find();
        res.json(notas);
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).send('Error en el servidor al obtener notas');
    }
});

// Agregar una nueva nota
router.post('/', async (req, res) => {
    const { text, timestamp } = req.body;

    try {
        const nuevaNota = new Nota({ text, timestamp });
        await nuevaNota.save();
        res.status(201).json(nuevaNota);
    } catch (error) {
        console.error('Error al agregar nota:', error);
        res.status(500).send('Error en el servidor al agregar nota');
    }
});

// Eliminar una nota por ID
router.delete('/:id', async (req, res) => {
    try {
        await Nota.findByIdAndDelete(req.params.id);
        res.send('Nota eliminada');
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).send('Error en el servidor al eliminar nota');
    }
});

module.exports = router;
