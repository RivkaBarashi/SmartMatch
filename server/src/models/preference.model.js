const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    ageMin: { type: Number },
    ageMax: { type: Number },
    style: { type: String, enum: ['conservative', 'classic', 'open'] },
    ethnicity: { type: String, enum: ['ashkenazi', 'sephardic', 'yemenite', 'other'] },
    appearance: { type: String, enum: ['slim', 'average', 'full', 'chubby'] },
    heightMin: { type: Number },
    heightMax: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Preference', preferenceSchema);
