const express = require('express');
const router = express.Router();
const autosController = require('../controllers/autosController');
const auth = require('../middleware/auth');

router.post('/',
    auth,
    autosController.subirArchivo
);

router.get('/:archivo',
    autosController.descargar,
);

router.delete('/:archivo',
    autosController.eliminarArchivo
);

module.exports = router;
