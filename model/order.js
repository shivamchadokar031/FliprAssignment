// models/order.js
const db = require('../db/db');

// Order model to interact with orders table
const Order = {
  create: async (orderId, customerId, productId, quantity, price, shippingDetails) => {
    const [result] = await db.promise().query(
      'INSERT INTO orders (order_id, customer_id, product_id, quantity, price, shipping_details) VALUES (?, ?, ?, ?, ?, ?)',
      [orderId, customerId, productId, quantity, price, shippingDetails]
    );
    return result;
  },

  findAll: async () => {
    const [orders] = await db.promise().query('SELECT * FROM orders');
    return orders;
  },

  findByCustomerId: async (customerId) => {
    const [orders] = await db.promise().query(
      'SELECT order_id, shipping_details FROM orders WHERE customer_id = ?',
      [customerId]
    );
    return orders;
  }
};

module.exports = Order;
