const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Obtener el carrito de un usuario (simulando un carrito para el usuario actual)
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json(cart ? cart.items : []);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error en el servidor al obtener el carrito');
    }
});

// Actualizar el carrito
router.put('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { userId: req.params.userId },
            { items: req.body },
            { new: true, upsert: true }
        );
        res.send('Carrito actualizado');
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).send('Error al actualizar el carrito');
    }
});

module.exports = router;
