const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true }, // e.g., 'projects', 'stack', 'about'
  data: { type: mongoose.Schema.Types.Mixed, required: true } // JSON data
}, { timestamps: true });

module.exports = mongoose.model('Content', contentSchema);
