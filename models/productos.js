const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    Sinonimo: { type: String, required: true },
    EAN: { type: String, required: true },
    Familia1: { type: String, required: true },
    Familia2: { type: String },
    Descripcion: { type: String, required: true },
    UniBulto: { type: Number, required: true },
    PrecioLista: { type: Number, required: true },
    Oferta: { type: String, required: true },
    Marca: { type: String, required: true }
});

module.exports = mongoose.model('Producto', productoSchema);
