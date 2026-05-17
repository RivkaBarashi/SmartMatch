const Interest = require('../models/interest.model');
const User = require('../models/user.model');

const getPendingMatches = async () => {
  // Get interests where both sides approved to send to manager and status is accepted
  return await Interest.find({
    status: 'accepted',
    senderApprovedToManager: true,
    receiverApprovedToManager: true,
  })
    .populate('sender', 'name idNumber role')
    .populate('receiver', 'name idNumber role')
    .sort({ updatedAt: -1 });
};

const removePendingMatch = async (senderId, receiverId) => {
  const interest = await Interest.findOne({ sender: senderId, receiver: receiverId });
  
  if (!interest) {
    const error = new Error('Interest not found');
    error.statusCode = 404;
    throw error;
  }

  if (!interest.senderApprovedToManager || !interest.receiverApprovedToManager) {
    const error = new Error('This match is not pending for manager');
    error.statusCode = 400;
    throw error;
  }

  interest.senderApprovedToManager = false;
  interest.receiverApprovedToManager = false;
  
  return await interest.save();
};

const getAllUsers = async () => {
  return await User.find({ role: 'user' }).select('name idNumber role -password');
};

module.exports = {
  getPendingMatches,
  removePendingMatch,
  getAllUsers,
};
