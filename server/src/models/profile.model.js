const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    gender: { type: String, enum: ["male", "female"], required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    height: { type: Number, required: true },

    style: { type: String, enum: ["conservative", "classic", "open"], required: true },
    appearance: { type: String, enum: ["slim", "average", "full", "chubby"] },

    financialAmount: { type: Number },

    description: { type: String },

    yeshiva: { type: String },
    seminary: { type: String },
    occupation: { type: String },

    resumePdf: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);