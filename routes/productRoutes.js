const express = require('express');
const router = express.Router();
const { addProduct, updateProduct, deleteProduct, getAllProducts } = require('../controllers/productController');

// Routes
router.post('/add', addProduct);
router.put('/update/:productId', updateProduct);
router.delete('/delete/:productId', deleteProduct);
router.get('/all', getAllProducts);

module.exports = router;
