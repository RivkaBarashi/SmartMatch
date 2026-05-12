const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    ageMin: { type: Number },
    ageMax: { type: Number },

    heightMin: { type: Number },
    heightMax: { type: Number },

    style: { type: String, enum: ["conservative", "modern", "open", "classic"] },
    ethnicity: { type: String, enum: ["ashkenazi", "sephardic", "yemenite", "other"] },
    appearance: { type: String, enum: ["slim", "average", "full", "chubby"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Preference", preferenceSchema);
