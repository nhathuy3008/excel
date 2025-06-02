// models/Solution.js
const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Solution', solutionSchema);
