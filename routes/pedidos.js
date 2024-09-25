const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedidos');

// Guardar un nuevo pedido
router.post('/', async (req, res) => {
    const pedido = new Pedido(req.body);
    try {
        await pedido.save();
        res.status(201).send('Pedido guardado');
    } catch (error) {
        console.error('Error al guardar el pedido:', error);
        res.status(500).send('Error al guardar el pedido');
    }
});

// Obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.find();
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).send('Error en el servidor al obtener los pedidos');
    }
});

// Obtener un pedido por ID
router.get('/:id', async (req, res) => {
    try {
        const pedido = await Pedido.findById(req.params.id);
        res.json(pedido);
    } catch (error) {
        console.error('Error al obtener pedido:', error);
        res.status(500).send('Error al obtener pedido');
    }
});

// Confirmar pedido
router.put('/:id/confirmar', async (req, res) => {
    try {
        await Pedido.findByIdAndUpdate(req.params.id, { status: 'confirmado' });
        res.send('Pedido confirmado');
    } catch (error) {
        console.error('Error al confirmar pedido:', error);
        res.status(500).send('Error al confirmar pedido');
    }
});

// Guardar pedido
router.put('/:id/guardar', async (req, res) => {
    try {
        await Pedido.findByIdAndUpdate(req.params.id, { status: 'guardado' });
        res.send('Pedido guardado');
    } catch (error) {
        console.error('Error al guardar pedido:', error);
        res.status(500).send('Error al guardar pedido');
    }
});

// Cancelar pedido
router.put('/:id/cancelar', async (req, res) => {
    try {
        await Pedido.findByIdAndUpdate(req.params.id, { status: 'cancelado' });
        res.send('Pedido cancelado');
    } catch (error) {
        console.error('Error al cancelar pedido:', error);
        res.status(500).send('Error al cancelar pedido');
    }
});

module.exports = router;
