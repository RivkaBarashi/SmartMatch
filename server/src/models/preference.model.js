const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    ageMin: { type: Number },
    ageMax: { type: Number },
    city: { type: String },
    heightMin: { type: Number },
    heightMax: { type: Number },
    style: { type: String, enum: ['modest', 'classic', 'open'] },
    financialLevel: { type: String, enum: ['low', 'medium', 'high', 'very_high'] },
    yeshiva: { type: String },
    seminary: { type: String }
},
  { timestamps: true }
);

module.exports = mongoose.model('Preference', preferenceSchema);