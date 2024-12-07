
const db = require('../db/db');

const Product = {
  create: async (name, description, price, category, stock) => {
    const [result] = await db.promise().query(
      'INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category, stock || 0]
    );
    return result;
  },

  findById: async (id) => {
    const [product] = await db.promise().query('SELECT * FROM products WHERE id = ?', [id]);
    return product[0];
  },

  findAll: async () => {
    const [products] = await db.promise().query('SELECT * FROM products');
    return products;
  },

  update: async (id, name, description, price, category, stock) => {
    const [result] = await db.promise().query(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ? WHERE id = ?',
      [name, description, price, category, stock, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.promise().query('DELETE FROM products WHERE id = ?', [id]);
    return result;
  }
};

module.exports = Product;
