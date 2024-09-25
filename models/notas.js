const mongoose = require('mongoose');

const notaSchema = new mongoose.Schema({
    text: { type: String, required: true },
    timestamp: { type: String, required: true }
});

module.exports = mongoose.model('Nota', notaSchema);

