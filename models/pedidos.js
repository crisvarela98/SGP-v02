const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    id: { type: String, required: true },
    customer: {
        name: { type: String, required: true },
        storeName: { type: String },
        address: { type: String },
        phone: { type: String },
        email: { type: String },
    },
    zone: { type: String, required: true },
    date: { type: String, required: true },
    status: { type: String, required: true },
    cart: [
        {
            codigo: { type: String, required: true },
            descripcion: { type: String, required: true },
            unidades: { type: Number, required: true },
            precioUnitario: { type: Number, required: true },
            descuento: { type: String }
        }
    ],
    total: { type: Number, required: false }, // Total del pedido
    notas: { type: String, required: false }, // Notas adicionales
    userId: { type: String, required: false }, // ID del vendedor o usuario que hizo el pedido
    IVA: { type: Number, required: false }, // Valor de IVA si aplica
    direccionEnvio: { type: String, required: false }, // Dirección de envío si es distinta a la del cliente
}, { timestamps: true }); // Para incluir createdAt y updatedAt automáticamente

module.exports = mongoose.model('Pedido', pedidoSchema);
