const {
  createPreferenceForUser,
  getPreferenceByUserId,
  updatePreferenceByUserId,
} = require("../services/preference.service");

const getPreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const preferences = await getPreferenceByUserId(userId);

    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }

    res.status(200).json({
      message: "Preferences retrieved successfully",
      preferences: {
        _id: preferences._id,
        ageMin: preferences.ageMin,
        ageMax: preferences.ageMax,
        style: preferences.style,
        ethnicity: preferences.ethnicity,
        appearance: preferences.appearance,
        heightMin: preferences.heightMin,
        heightMax: preferences.heightMax,
      },
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      ageMin,
      ageMax,
      style,
      ethnicity,
      appearance,
      heightMin,
      heightMax,
    } = req.body;

    const updateData = {
      ...(ageMin !== undefined && { ageMin: parseInt(ageMin) }),
      ...(ageMax !== undefined && { ageMax: parseInt(ageMax) }),
      ...(style !== undefined && { style }),
      ...(ethnicity !== undefined && { ethnicity }),
      ...(appearance !== undefined && { appearance }),
      ...(heightMin !== undefined && { heightMin: parseInt(heightMin) }),
      ...(heightMax !== undefined && { heightMax: parseInt(heightMax) }),
    };

    const preferences = await updatePreferenceByUserId(userId, updateData);

    if (!preferences) {
      return res.status(404).json({ message: "Preferences not found" });
    }

    res.status(200).json({
      message: "Preferences updated successfully",
      preferences: {
        _id: preferences._id,
        ageMin: preferences.ageMin,
        ageMax: preferences.ageMax,
        style: preferences.style,
        ethnicity: preferences.ethnicity,
        appearance: preferences.appearance,
        heightMin: preferences.heightMin,
        heightMax: preferences.heightMax,
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPreferences, updatePreferences };
