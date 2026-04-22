const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    height: { type: Number, required: true },
    style: { type: String, enum: ['modest', 'classic', 'open'], required: true },
    description: { type: String },
    yeshiva: { type: String },
    seminary: { type: String },
    occupation : { type: String },
    financialLevel: { type: String, enum: ['low', 'medium', 'high' , 'very_high'] },

    resumePdf: { type: String },
    image: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', profileSchema);