// const express = require('express');
// const router = express.Router();
// const carController = require('../controllers/carController');

// router.post('/create', carController.createCar);
// router.get('/', carController.getAllCars);
// router.get('/:id', carController.getCarById);    // <-- Thêm route lấy chi tiết xe
// router.put('/:id', carController.updateCar);
// router.delete('/:id', carController.deleteCar);
// router.get('/export/pdf', carController.exportCarsToPDF);
// module.exports = router;
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const verifyToken = require('../middleware/authMiddleware');

// Bảo vệ tất cả các route
router.use(verifyToken);

// ✅ Route xuất PDF phải để trước '/:id'
router.get('/export/pdf', carController.exportCarsToPDF);

// Các route còn lại
router.post('/create', carController.createCar);
router.get('/', carController.getAllCars);
router.get('/:id', carController.getCarById);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);

module.exports = router;
