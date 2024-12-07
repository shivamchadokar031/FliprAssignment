const express = require('express');
const router = express.Router();
const { addToCart, updateCart, deleteCartItem, getCart } = require('../controllers/cartController');

// Routes
router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/delete', deleteCartItem);
router.get('/', getCart);

module.exports = router;
