const express = require('express');
const router = express.Router();
const { placeOrder, getAllOrders, getCustomerOrders } = require('../controllers/orderController');

// Routes
router.post('/place', placeOrder);
router.get('/all', getAllOrders);
router.get('/customer/:customerId', getCustomerOrders);

module.exports = router;
