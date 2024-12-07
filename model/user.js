
const db = require('../db/db');

const User = {
  create: async (name, email, password, address) => {
    const [result] = await db.promise().query(
      'INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)',
      [name, email, password, address || null]
    );
    return result;
  },

  findByEmail: async (email) => {
    const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
    return user[0];
  },

  findById: async (id) => {
    const [user] = await db.promise().query('SELECT * FROM users WHERE id = ?', [id]);
    return user[0];
  },

  update: async (id, name, email, password, address) => {
    const [result] = await db.promise().query(
      'UPDATE users SET name = ?, email = ?, password = ?, address = ? WHERE id = ?',
      [name, email, password, address, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.promise().query('DELETE FROM users WHERE id = ?', [id]);
    return result;
  }
};

module.exports = User;
