const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    age: { type: Number },
    // Male-specific fields
    yeshiva: { type: String },
    financialRequirement: { type: String },
    // Female-specific fields
    seminar: { type: String },
    occupation: { type: String },
    financialCapabilities: { type: String },
    // Common fields
    style: { type: String, enum: ['conservative', 'modern', 'open'] },
    city: { type: String },
    ethnicity: { type: String, enum: ['ashkenazi', 'sephardic', 'yemenite', 'other'] },
    appearance: { type: String, enum: ['slim', 'average', 'full', 'chubby'] },
    height: { type: Number },
    description: { type: String },
    resumePDF: { type: String },
    profileImage: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    const bcrypt = require('bcrypt');
    this.password = await bcrypt.hash(this.password, 12);
  }
});

module.exports = mongoose.model('User', userSchema);
