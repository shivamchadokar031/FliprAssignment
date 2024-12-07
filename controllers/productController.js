const db = require('../db/db');

exports.addProduct = async (req, res) => {
    const { name, description, price, category, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required.' });
    }
  
    if (price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number.' });
    }
  
    if (stock && stock < 0) {
      return res.status(400).json({ error: 'Stock cannot be a negative number.' });
    }
  
    try {

      const [result] = await db.promise().query(
        'INSERT INTO products (name, description, price, category, stock) VALUES (?, ?, ?, ?, ?)',
        [name, description || '', price, category, stock || 0]
      );
  

      res.status(201).json({
        message: 'Product added successfully.',
        productId: result.insertId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { name, description, price, category, stock } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }
  
    if (price !== undefined && price <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number.' });
    }
  
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ error: 'Stock cannot be negative.' });
    }
  
    try {

      const [existingProduct] = await db
        .promise()
        .query('SELECT * FROM products WHERE id = ?', [productId]);
  
      if (existingProduct.length === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  

      const updates = [];
      const values = [];
  
      if (name) {
        updates.push('name = ?');
        values.push(name);
      }
      if (description) {
        updates.push('description = ?');
        values.push(description);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(price);
      }
      if (category) {
        updates.push('category = ?');
        values.push(category);
      }
      if (stock !== undefined) {
        updates.push('stock = ?');
        values.push(stock);
      }
  
      if (updates.length === 0) {
        return res
          .status(400)
          .json({ error: 'At least one field must be provided for update.' });
      }
  
      values.push(productId);
  
      const [result] = await db
        .promise()
        .query(
          `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
  
      if (result.affectedRows === 1) {
        return res.status(200).json({ message: 'Product updated successfully.' });
      }
  
      res.status(500).json({ error: 'Failed to update the product.' });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;


    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }
  
    try {

      const [product] = await db
        .promise()
        .query('SELECT * FROM products WHERE id = ?', [productId]);
  
      if (product.length === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }
  
      // Delete the product
      const [result] = await db
        .promise()
        .query('DELETE FROM products WHERE id = ?', [productId]);
  
      if (result.affectedRows === 1) {
        return res.status(200).json({ message: 'Product deleted successfully.' });
      }
  
      res.status(500).json({ error: 'Failed to delete the product.' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.promise().query('SELECT * FROM products');
        if (!products.length) {
          return res.status(404).json({ error: 'No products found' });
        }
    
        res.json({ products });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
};
