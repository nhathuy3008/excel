const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/create', carController.createCar);
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);    // <-- Thêm route lấy chi tiết xe
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);
router.get('/export/pdf', carController.exportCarsToPDF);
module.exports = router;
