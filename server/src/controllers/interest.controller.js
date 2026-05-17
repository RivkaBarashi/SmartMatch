const {
  sendInterest,
  respondInterest,
  getIncomingInterests,
  getOutgoingInterests,
  approveToManager,
} = require('../services/interest.service');

const createInterest = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId is required' });
    }

    const interest = await sendInterest(senderId, receiverId);
    res.status(201).json({ message: 'Interest created', interest });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getIncoming = async (req, res) => {
  try {
    const userId = req.user.userId;
    const interests = await getIncomingInterests(userId);
    res.status(200).json({ interests });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const getOutgoing = async (req, res) => {
  try {
    const userId = req.user.userId;
    const interests = await getOutgoingInterests(userId);
    res.status(200).json({ interests });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const respondToInterest = async (req, res) => {
  try {
    const receiverId = req.user.userId;
    const { senderId, status } = req.body;

    if (!senderId || !status) {
      return res.status(400).json({ message: 'senderId and status are required' });
    }

    const interest = await respondInterest(senderId, receiverId, status);
    res.status(200).json({ message: 'Interest updated', interest });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

const sendToManager = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: 'otherUserId is required' });
    }

    const interest = await approveToManager(userId, otherUserId, 'sender');
    res.status(200).json({ message: 'Approved to send to manager', interest });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

module.exports = {
  createInterest,
  getIncoming,
  getOutgoing,
  respondToInterest,
  sendToManager,
};
