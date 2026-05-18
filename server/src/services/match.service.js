const Interest = require('../models/interest.model');
const Profile = require('../models/profile.model');
const Preference = require('../models/preference.model');
const User = require('../models/user.model');

const getMatchesForUser = async (userId) => {
  // Get all accepted interests involving this user (either as sender or receiver)
  const allAccepted = await Interest.find({
    $or: [
      { sender: userId, status: 'accepted' },
      { receiver: userId, status: 'accepted' }
    ]
  })
    .populate('sender', 'name idNumber role')
    .populate('receiver', 'name idNumber role')
    .lean();

  // Extract the other user from each interest record
  const matches = allAccepted.map((item) => {
    const otherUser = item.sender._id.toString() === userId ? item.receiver : item.sender;
    return {
      _id: otherUser._id,
      name: otherUser.name,
      idNumber: otherUser.idNumber,
      role: otherUser.role,
      matchedAt: item.updatedAt || item.createdAt,
    };
  });

  return matches;
};

const checkProfileMatch = (userProfile, candidateProfile, userPreference, candidatePreference) => {
  // Check gender - opposite genders only
  if (userProfile.gender === candidateProfile.gender) {
    return false;
  }

  // Check user's preferences against candidate's profile
  if (userPreference) {
    if (userPreference.ageMin && candidateProfile.age < userPreference.ageMin) return false;
    if (userPreference.ageMax && candidateProfile.age > userPreference.ageMax) return false;
    if (userPreference.heightMin && candidateProfile.height < userPreference.heightMin) return false;
    if (userPreference.heightMax && candidateProfile.height > userPreference.heightMax) return false;
    if (userPreference.style && candidateProfile.style !== userPreference.style) return false;
    if (userPreference.preferredAppearance && candidateProfile.appearance !== userPreference.preferredAppearance) return false;
    if (userPreference.city && candidateProfile.city !== userPreference.city) return false;
    if (userPreference.financialMin && candidateProfile.financialStatus && candidateProfile.financialStatus < userPreference.financialMin) return false;
    if (userPreference.financialMax && candidateProfile.financialStatus && candidateProfile.financialStatus > userPreference.financialMax) return false;
  }

  // Check candidate's preferences against user's profile
  if (candidatePreference) {
    if (candidatePreference.ageMin && userProfile.age < candidatePreference.ageMin) return false;
    if (candidatePreference.ageMax && userProfile.age > candidatePreference.ageMax) return false;
    if (candidatePreference.heightMin && userProfile.height < candidatePreference.heightMin) return false;
    if (candidatePreference.heightMax && userProfile.height > candidatePreference.heightMax) return false;
    if (candidatePreference.style && userProfile.style !== candidatePreference.style) return false;
    if (candidatePreference.preferredAppearance && userProfile.appearance !== candidatePreference.preferredAppearance) return false;
    if (candidatePreference.city && userProfile.city !== candidatePreference.city) return false;
    if (candidatePreference.financialMin && userProfile.financialStatus && userProfile.financialStatus < candidatePreference.financialMin) return false;
    if (candidatePreference.financialMax && userProfile.financialStatus && userProfile.financialStatus > candidatePreference.financialMax) return false;
  }

  return true;
};

const getCandidatesForUser = async (userId) => {
  // Get user's profile and preferences
  const userProfile = await Profile.findOne({ user: userId });
  const userPreference = await Preference.findOne({ user: userId });

  if (!userProfile) {
    const error = new Error('User profile not found');
    error.statusCode = 404;
    throw error;
  }

  // Get all interests from this user (to exclude them)
  const existingInterests = await Interest.find({ sender: userId }).select('receiver').lean();
  const excludedUserIds = new Set(
    existingInterests.map((i) => i.receiver._id.toString())
  );
  excludedUserIds.add(userId); // Exclude self

  // Get all profiles
  const allProfiles = await Profile.find({ user: { $nin: Array.from(excludedUserIds).map((id) => id) } })
    .populate('user', 'name idNumber role')
    .lean();

  // Filter candidates based on matching logic
  const candidates = [];
  for (const profile of allProfiles) {
    const candidatePreference = await Preference.findOne({ user: profile.user._id });

    if (checkProfileMatch(userProfile, profile, userPreference, candidatePreference)) {
      candidates.push({
        _id: profile.user._id,
        name: profile.user.name,
        idNumber: profile.user.idNumber,
        age: profile.age,
        city: profile.city,
        height: profile.height,
        style: profile.style,
        appearance: profile.appearance,
        gender: profile.gender,
        description: profile.description,
      });
    }
  }

  return candidates;
};

module.exports = {
  getMatchesForUser,
  getCandidatesForUser,
};
