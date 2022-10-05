const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enlacesShema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: false,
        default: 1
    },
    auto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autos',
        default: null
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios',
        default: null
    },
    yonke: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Yonkes',
        default: null
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Piezas', enlacesShema);
