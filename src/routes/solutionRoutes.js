const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/solutionController');

router.post('/create', solutionController.createSolution);
router.get('/', solutionController.getAllSolutions);
router.put('/:id', solutionController.updateSolution);
router.delete('/:id', solutionController.deleteSolution);

module.exports = router;
