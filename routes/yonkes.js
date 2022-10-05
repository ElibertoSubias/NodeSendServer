const express = require('express');
const router = express.Router();
const yonkesController = require('../controllers/yonkesController');
const auth = require('../middleware/auth');

router.post('/crear',
    auth,
    yonkesController.crearYonke
);

router.get('/',
    yonkesController.obtenerYonkes
);

router.get('/buscar/:id',
    yonkesController.obtenerYonke,
);

router.put('/modificar',
    auth,
    yonkesController.modificarYonke
);

module.exports = router;
