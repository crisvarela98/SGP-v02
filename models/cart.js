const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    codigo: { type: String, required: true },
    descripcion: { type: String, required: true },
    unidades: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    descuento: { type: String }
});

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
