const express = require('express');
const router = express.Router();
const piezasController = require('../controllers/piezasController');
const auth = require('../middleware/auth');

router.post('/',
    auth,
    piezasController.subirArchivo
);

router.get('/:archivo',
    piezasController.descargar,
);

router.delete('/:archivo',
    piezasController.eliminarArchivo
);

module.exports = router;
