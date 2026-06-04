const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  brandName:       { type: String, required: true, trim: true },
  title:           { type: String, required: true, trim: true },
  tagBadge:        { type: String, default: '', trim: true },
  year:            { type: String, default: '', trim: true },
  description:     { type: String, default: '', trim: true },
  category:        { type: String, enum: ['Brand Identity', 'Social Media', 'Campaigns', 'Product'], default: 'Brand Identity' },
  bgColor:         { type: String, default: '#111111', trim: true },
  accentColor:     { type: String, default: '#e4f141', trim: true },
  stats:           { type: String, default: '', trim: true },
  coverImage:      { type: String, default: null },
  projectLink:     { type: String, default: '', trim: true },
  sortOrder:       { type: Number, default: 0 },
  deletedAt:       { type: Date, default: null },
  deletedBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
