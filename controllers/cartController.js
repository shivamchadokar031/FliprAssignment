const db = require('../db/db');

exports.addToCart = async (req, res) => {
    const { customerId, productId, quantity } = req.body;

    if (!customerId || !productId || !quantity) {
      return res.status(400).json({ error: 'customerId, productId, and quantity are required' });
    }
  
    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }
  
    try {
      
      const [product] = await db.promise().query('SELECT stock FROM products WHERE id = ?', [productId]);
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      if (product[0].stock < quantity) {
        return res.status(400).json({ error: 'Insufficient stock available' });
      }
  
      
      const [cartEntry] = await db.promise().query(
        'SELECT quantity FROM cart WHERE customer_id = ? AND product_id = ?',
        [customerId, productId]
      );
  
      if (cartEntry.length > 0) {
        
        const newQuantity = cartEntry[0].quantity + quantity;
        await db.promise().query(
          'UPDATE cart SET quantity = ? WHERE customer_id = ? AND product_id = ?',
          [newQuantity, customerId, productId]
        );
      } else {
        
        await db.promise().query(
          'INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)',
          [customerId, productId, quantity]
        );
      }
  
      const [updatedCart] = await db.promise().query(
        `SELECT c.product_id, p.name, c.quantity, p.price 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.customer_id = ?`,
        [customerId]
      );
  
      res.status(200).json({
        message: 'Product added to cart successfully',
        cart: updatedCart,
      });
    } catch (err) {
      console.error('Error adding product to cart:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCart = async (req, res) => {
    const { customerId, productId, quantity } = req.body;


    if (productId === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Product ID and quantity are required' });
    }
  
    if (quantity < 0) {
      return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
    }
  
    try {
     
      const [product] = await db.promise().query('SELECT stock FROM products WHERE id = ?', [productId]);
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const [cartEntry] = await db.promise().query(
        'SELECT quantity FROM cart WHERE customer_id = ? AND product_id = ?',
        [customerId, productId]
      );
  
      if (cartEntry.length === 0) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }

      if (quantity > product[0].stock) {
        return res.status(400).json({ error: 'Insufficient stock available' });
      }
  
      if (quantity === 0) {

        await db.promise().query(
          'DELETE FROM cart WHERE customer_id = ? AND product_id = ?',
          [customerId, productId]
        );
      } else {

        await db.promise().query(
          'UPDATE cart SET quantity = ? WHERE customer_id = ? AND product_id = ?',
          [quantity, customerId, productId]
        );
      }
  

      const [updatedCart] = await db.promise().query(
        `SELECT c.product_id, p.name, c.quantity, p.price 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.customer_id = ?`,
        [customerId]
      );
  
      res.status(200).json({
        message: 'Cart updated successfully',
        cart: updatedCart,
      });
    } catch (err) {
      console.error('Error updating cart:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCartItem = async (req, res) => {
    const { customerId, productId } = req.body;

   
    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }
  
    try {

      const [cartEntry] = await db.promise().query(
        'SELECT quantity FROM cart WHERE customer_id = ? AND product_id = ?',
        [customerId, productId]
      );
  
      if (cartEntry.length === 0) {
        return res.status(404).json({ error: 'Product not found in cart' });
      }
  
    
      await db.promise().query(
        'DELETE FROM cart WHERE customer_id = ? AND product_id = ?',
        [customerId, productId]
      );
  
      const [updatedCart] = await db.promise().query(
        `SELECT c.product_id, p.name, c.quantity, p.price 
         FROM cart c 
         JOIN products p ON c.product_id = p.id 
         WHERE c.customer_id = ?`,
        [customerId]
      );
  
      res.status(200).json({
        message: 'Product removed from cart successfully',
        cart: updatedCart,
      });
    } catch (err) {
      console.error('Error removing product from cart:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCart = async (req, res) => {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ error: 'Customer ID is required' });
    }
  
    try {
      const [cartDetails] = await db.promise().query(
        `SELECT c.product_id, p.name, c.quantity, p.price
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.customer_id = ?`,
        [customerId]
      );
  

      if (cartDetails.length === 0) {
        return res.status(200).json({ message: 'Your cart is empty' });
      }
  

      const totalAmount = cartDetails.reduce((total, item) => {
        return total + item.quantity * item.price;
      }, 0);
  
      res.status(200).json({
        cart: cartDetails,
        totalAmount: totalAmount,
      });
    } catch (err) {
      console.error('Error fetching cart details:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};
