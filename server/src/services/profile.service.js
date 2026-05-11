const Profile = require("../models/profile.model");

const createProfileForUser = async (userId, profileData) => {
  const existingProfile = await Profile.findOne({ user: userId });

  if (existingProfile) {
    throw new Error("Profile already exists");
  }

  return await Profile.create({
    user: userId,
    ...profileData,
  });
};

const getProfileByUserId = async (userId) => {
  return await Profile.findOne({ user: userId });
};

const updateProfileByUserId = async (userId, profileData) => {
  return await Profile.findOneAndUpdate(
    { user: userId },
    profileData,
    { new: true }
  );
};

module.exports = {
  createProfileForUser,
  getProfileByUserId,
  updateProfileByUserId,
};