const express = require('express');
const router = express.Router();
const Producto = require('../models/productos');  // Asegúrate de que la ruta del modelo es correcta

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();  // Obtiene todos los productos
        if (productos.length === 0) {
            console.log('No se encontraron productos en la base de datos');  // Mensaje de log para comprobar si hay productos
        }
        res.json(productos);  // Envía los productos como respuesta JSON
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error en el servidor al obtener los productos');
    }
});

module.exports = router;

