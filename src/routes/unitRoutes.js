const express = require('express');
const router = express.Router();
const unitController = require('../controllers/unitController');

router.post('/create', unitController.createUnit);
router.get('/', unitController.getAllUnits);
router.put('/:id', unitController.updateUnit);
router.delete('/:id', unitController.deleteUnit);

module.exports = router;
