const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enlacesShema = new Schema({
    calle: {
        type: String,
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    colonia: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: false,
        default: ""
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Direcciones', enlacesShema);
