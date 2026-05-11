const {
  createPreferenceForUser,
  getPreferenceByUserId,
  updatePreferenceByUserId,
} = require("../services/preference.service");

const createPreference = async (req, res) => {
  try {
    const userId = req.user.userId;

    const preference = await createPreferenceForUser(userId, req.body);

    res.status(201).json(preference);
  } catch (error) {
    if (error.message === "Preference already exists") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

const getMyPreference = async (req, res) => {
  try {
    const userId = req.user.userId;

    const preference = await getPreferenceByUserId(userId);

    if (!preference) {
      return res.status(404).json({ message: "Preference not found" });
    }

    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePreference = async (req, res) => {
  try {
    const userId = req.user.userId;

    const preference = await updatePreferenceByUserId(userId, req.body);

    if (!preference) {
      return res.status(404).json({ message: "Preference not found" });
    }

    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPreference,
  getMyPreference,
  updatePreference,
};