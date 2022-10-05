const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enlacesShema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
        default: null
    },
    direccion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Direcciones',
        default: null
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Yonkes', enlacesShema);
