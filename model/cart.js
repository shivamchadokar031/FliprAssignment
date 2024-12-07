
const db = require('../db/db');


const Cart = {
  addProduct: async (customerId, productId, quantity) => {
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
  },

  updateProduct: async (customerId, productId, quantity) => {
    await db.promise().query(
      'UPDATE cart SET quantity = ? WHERE customer_id = ? AND product_id = ?',
      [quantity, customerId, productId]
    );
  },

  removeProduct: async (customerId, productId) => {
    await db.promise().query(
      'DELETE FROM cart WHERE customer_id = ? AND product_id = ?',
      [customerId, productId]
    );
  },

  getCartItems: async (customerId) => {
    const [cartItems] = await db.promise().query(
      `SELECT c.product_id, p.name, c.quantity, p.price
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.customer_id = ?`,
      [customerId]
    );
    return cartItems;
  }
};

module.exports = Cart;
