const express = require('express');
const { createOrder, getOrders } = require('../controller/orderController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);

module.exports = router;
