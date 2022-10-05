const express = require('express');
const router = express.Router();
const direccionesController = require('../controllers/direccionesController');
const auth = require('../middleware/auth');

router.post('/',
    auth,
    direccionesController.subirArchivo
);

router.get('/:archivo',
    direccionesController.descargar,
);

router.delete('/:archivo',
    direccionesController.eliminarArchivo
);

module.exports = router;
