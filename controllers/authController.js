const db = require('../db/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { name, email, password, address } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
  
    try {
      const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length) {
        return res.status(409).json({ error: 'Email is already registered.' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const [result] = await db.promise().query(
        'INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, address || null]
      );
  
      res.status(201).json({ message: 'User registered successfully.', customerId: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const [user] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
      if (!user.length) {
        return res.status(404).json({ error: 'Invalid credentials' });
      }
  
      const isValid = await bcrypt.compare(password, user[0].password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };
  