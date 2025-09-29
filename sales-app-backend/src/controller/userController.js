const prisma = require('../prisma');

const getProfile = async (req, res) => {
  res.json(req.user);
};

const getAllUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

// List semua user (khusus super admin)
const listUsers = async (req, res) => {
  // Optional: cek role superadmin
  if (req.user.role !== "SUPERADMIN") return res.status(403).json({ message: "Forbidden" });
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      // tambahkan field lain jika ada
    }
  });
  res.json(users);
};

// Detail user by id (khusus super admin)
const userDetail = async (req, res) => {
  if (req.user.role !== "SUPERADMIN") return res.status(403).json({ message: "Forbidden" });
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      // field lain jika ada
    }
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Update profile (boleh untuk semua user, hanya dirinya sendiri)
const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const data = { name, email };
  if (password) {
    const bcrypt = require("bcrypt");
    data.password = await bcrypt.hash(password, 10);
  }
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    }
  });
  res.json(user);
};

module.exports = { getProfile, getAllUsers, listUsers, userDetail, updateProfile };
