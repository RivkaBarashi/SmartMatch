const User = require("../models/user.model");
const Preference = require("../models/preference.model");
const path = require("path");

const updateProfile = async (req, res) => {
  try {
    console.log('Profile controller called');
    const userId = req.user?.userId;
    console.log('User ID:', userId);

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Handle both JSON body and FormData (multer populates req.body for text fields)
    const body = req.body || {};
    console.log('Request body keys:', Object.keys(body));
    console.log('Request files:', req.files ? Object.keys(req.files) : 'no files');

    const {
      name,
      id,
      email,
      gender,
      age,
      yeshiva,
      financialRequirement,
      seminar,
      occupation,
      financialCapabilities,
      style,
      city,
      ethnicity,
      appearance,
      height,
      description,
      // Preferences fields
      ageMin,
      ageMax,
      preferenceStyle,
      preferenceEthnicity,
      preferenceAppearance,
      heightMin,
      heightMax,
    } = body;

    // Check if the new id or email already exists for another user
    if (id || email) {
      const existingUser = await User.findOne({
        $or: [
          id ? { id, _id: { $ne: userId } } : null,
          email ? { email, _id: { $ne: userId } } : null,
        ].filter(Boolean)
      });
      if (existingUser) {
        return res.status(400).json({ message: 'ID or email already exists for another user' });
      }
    }

    const resumePDFPath = req.files?.resumePDF?.[0]?.path;
    const profileImagePath = req.files?.profileImage?.[0]?.path;

    // Store only the uploads-relative path (images/... and pdfs/...)
    const resumePDFRelative = resumePDFPath ? `pdfs/${path.basename(resumePDFPath)}` : undefined;
    const profileImageRelative = profileImagePath ? `images/${path.basename(profileImagePath)}` : undefined;

    const updateData = {
      ...(name && { name }),
      ...(id && { id }),
      ...(email && { email }),
      ...(gender && { gender }),
      ...(age !== undefined && { age: age ? parseInt(age) : undefined }),
      ...(gender === 'male' && yeshiva !== undefined && { yeshiva }),
      ...(gender === 'male' && financialRequirement !== undefined && { financialRequirement }),
      ...(gender === 'female' && seminar !== undefined && { seminar }),
      ...(gender === 'female' && occupation !== undefined && { occupation }),
      ...(gender === 'female' && financialCapabilities !== undefined && { financialCapabilities }),
      ...(style !== undefined && { style }),
      ...(city !== undefined && { city }),
      ...(ethnicity !== undefined && { ethnicity }),
      ...(appearance !== undefined && { appearance }),
      ...(height !== undefined && { height: height ? parseInt(height) : undefined }),
      ...(description !== undefined && { description }),
      ...(resumePDFRelative && { resumePDF: resumePDFRelative }),
      ...(profileImageRelative && { profileImage: profileImageRelative }),
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('User updated successfully:', updatedUser._id);

    // Update preferences if provided
    let updatedPreferences = null;
    if (ageMin !== undefined || ageMax !== undefined || preferenceStyle !== undefined ||
        preferenceEthnicity !== undefined || preferenceAppearance !== undefined ||
        heightMin !== undefined || heightMax !== undefined) {

      console.log('Updating preferences for user:', userId);
      const preferencesUpdateData = {
        ...(ageMin !== undefined && { ageMin: parseInt(ageMin) }),
        ...(ageMax !== undefined && { ageMax: parseInt(ageMax) }),
        ...(preferenceStyle !== undefined && { style: preferenceStyle }),
        ...(preferenceEthnicity !== undefined && { ethnicity: preferenceEthnicity }),
        ...(preferenceAppearance !== undefined && { appearance: preferenceAppearance }),
        ...(heightMin !== undefined && { heightMin: parseInt(heightMin) }),
        ...(heightMax !== undefined && { heightMax: parseInt(heightMax) }),
      };

      console.log('Preferences update data:', preferencesUpdateData);

      try {
        updatedPreferences = await Preference.findOneAndUpdate(
          { user: userId },
          preferencesUpdateData,
          { new: true, upsert: true }
        );
        console.log('Preferences updated successfully:', updatedPreferences._id);
      } catch (prefError) {
        console.error('Error updating preferences:', prefError);
        return res.status(500).json({ message: "Error updating preferences: " + prefError.message });
      }
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        id: updatedUser.id,
        email: updatedUser.email,
        gender: updatedUser.gender,
        age: updatedUser.age,
        yeshiva: updatedUser.yeshiva,
        financialRequirement: updatedUser.financialRequirement,
        seminar: updatedUser.seminar,
        occupation: updatedUser.occupation,
        financialCapabilities: updatedUser.financialCapabilities,
        style: updatedUser.style,
        city: updatedUser.city,
        ethnicity: updatedUser.ethnicity,
        appearance: updatedUser.appearance,
        height: updatedUser.height,
        description: updatedUser.description,
        resumePDF: updatedUser.resumePDF,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
      },
      preferences: updatedPreferences ? {
        _id: updatedPreferences._id,
        ageMin: updatedPreferences.ageMin,
        ageMax: updatedPreferences.ageMax,
        style: updatedPreferences.style,
        ethnicity: updatedPreferences.ethnicity,
        appearance: updatedPreferences.appearance,
        heightMin: updatedPreferences.heightMin,
        heightMax: updatedPreferences.heightMax,
      } : null,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateProfile };
