const express = require('express');
const router = express.Router();
const yonkesController = require('../controllers/yonkesController');
const auth = require('../middleware/auth');

router.post('/',
    auth,
    yonkesController.crearYonke
);

router.get('/',
    yonkesController.obtenerYonkes
);

router.get('/buscar/:id',
    yonkesController.obtenerYonke,
);

router.put('/',
    auth,
    yonkesController.modificarYonke
);

router.delete('/:id',
    auth,
    yonkesController.eliminarYonke
);

module.exports = router;
