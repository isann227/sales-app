const express = require('express');
const { getCart, addToCart } = require('../controller/cartController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getCart);
router.post('/', auth, addToCart);

module.exports = router;
