const {
  createProfileForUser,
  getProfileByUserId,
  updateProfileByUserId,
} = require("../services/profile.service");

const createProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await createProfileForUser(userId, req.body);

    res.status(201).json(profile);
  } catch (error) {
    if (error.message === "Profile already exists") {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await getProfileByUserId(userId);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const profile = await updateProfileByUserId(userId, req.body);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProfile,
  getMyProfile,
  updateProfile,
};