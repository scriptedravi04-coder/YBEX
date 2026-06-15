const mongoose = require('mongoose');
const creatorSchema = new mongoose.Schema({
  name:               { type: String, required: true, trim: true },
  imageUrl:           { type: String, default: null },
  instagramFollowers: { type: String, default: '' },
  averageReach:       { type: String, default: '' },
  socialLink:         { type: String, default: '' },
  backgroundText:     { type: String, default: 'YBEX' },
  deletedAt:          { type: Date, default: null },
  deletedBy:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });
module.exports = mongoose.model('Creator', creatorSchema);
