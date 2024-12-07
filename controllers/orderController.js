const db = require('../db/db');

exports.placeOrder = async (req, res) => {
    const { customerId, shippingDetails } = req.body;


    if (!customerId || !shippingDetails) {
      return res.status(400).json({ error: 'Customer ID and shipping details are required' });
    }
  
    try {

      const [cartItems] = await db.promise().query(
        `SELECT c.product_id, c.quantity, p.price
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.customer_id = ?`,
        [customerId]
      );
  

      if (cartItems.length === 0) {
        return res.status(400).json({ error: 'Cart is empty. Cannot place an order.' });
      }
 
      const orderId = `ORD-${Date.now()}`;
  
  
      const orderPromises = cartItems.map(async (item) => {
    
        await db.promise().query(
          `INSERT INTO orders (order_id, customer_id, product_id, quantity, price, shipping_details)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [orderId, customerId, item.product_id, item.quantity, item.price, shippingDetails]
        );
      });

      await Promise.all(orderPromises);
  
      await db.promise().query('DELETE FROM cart WHERE customer_id = ?', [customerId]);

      res.status(200).json({
        message: 'Order placed successfully',
        orderId: orderId,
      });
    } catch (err) {
      console.error('Error placing order:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {

        const query = `
          SELECT 
            * FROM orders;
        `;
    
       
        const [orders] = await db.promise().query(query);
    
        if (orders.length === 0) {
          return res.status(404).json({ message: 'No orders found' });
        }
    
     
        res.status(200).json({ orders });
      } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
};

exports.getCustomerOrders = async (req, res) => {
    const { customerId } = req.params;

    try {
 
      const query = 'SELECT order_id, shipping_details FROM orders WHERE customer_id = ?';
      

      const [orders] = await db.promise().query(query, [customerId]);
  
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this customer' });
      }
  
      
      res.status(200).json({ orders });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
};
