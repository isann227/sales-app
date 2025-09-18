const express = require('express');
const { getProfile, getAllUsers } = require('../controller/userController');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

router.get('/me', auth, getProfile);
router.get('/', auth, requireRole(['ADMIN','SUPERADMIN']), getAllUsers);

module.exports = router;
