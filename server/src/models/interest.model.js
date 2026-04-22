const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['sent', 'accepted', 'rejected'], default: 'sent' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Interest', interestSchema);