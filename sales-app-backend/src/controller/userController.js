const prisma = require('../prisma');

const getProfile = async (req, res) => {
  res.json(req.user);
};

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

module.exports = { getProfile, getAllUsers };
