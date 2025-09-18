const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

 const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // cek kalau email sudah ada
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    });

    res.status(201).json({ message: "Registrasi berhasil", user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // access token cepat expired
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // refresh token lebih lama
  );

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  res.json({ accessToken, refreshToken });
};

// 🆕 Refresh token
const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });

  try {
    // cek di DB
    const stored = await prisma.refreshToken.findFirst({
      where: { tokenHash: refreshToken, revoked: false }
    });
    if (!stored) return res.status(401).json({ error: 'Invalid refresh token' });

    // verifikasi token
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // generate access token baru
    const accessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token diperlukan" });
    }

    const token = await prisma.refreshToken.findUnique({
      where: { token: refreshToken }
    });

    if (!token) {
      return res.status(404).json({ message: "Refresh token tidak ditemukan" });
    }

    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revoked: true }
    });

    return res.json({ message: "Logout berhasil, token sudah direvoke" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

module.exports = { register, login, refresh, logout };
