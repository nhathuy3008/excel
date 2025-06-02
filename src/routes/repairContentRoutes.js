const express = require('express');
const router = express.Router();
const controller = require('../controllers/repairContentController');

router.post('/create', controller.createRepairContent);
router.get('/', controller.getAllRepairContents);
router.put('/:id', controller.updateRepairContent);
router.delete('/:id', controller.deleteRepairContent);

module.exports = router;
