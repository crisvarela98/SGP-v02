const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    id: { type: Number, required: true },  // Asegúrate de agregar el campo `id`
    name: { type: String, required: true },
    email: { type: String, required: true },
    storeName: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    zone: { type: String, required: true },
    locality: { type: String, required: true }
});

module.exports = mongoose.model('Cliente', clienteSchema);  // Asegúrate de que el nombre del modelo sea correcto
