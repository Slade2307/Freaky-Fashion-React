const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Connect to SQLite database
const db = new sqlite3.Database('./db/products.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// API endpoint to fetch products as JSON
router.get('/products/api', (req, res) => {
  const query = 'SELECT title, price, sku, categories FROM products';
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Failed to retrieve products:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve products' });
    }
    res.json(rows); // Return products as JSON
  });
});

// Route to render the product list page
router.get('/products', (req, res) => {
  res.render('admin/products/index'); // Render admin/products/index.ejs
});

// Route to render the new product form page
router.get('/products/new', (req, res) => {
  res.render('admin/products/new'); // Render admin/products/new.ejs
});

// Route to handle form submission and add a new product
router.post('/products', (req, res) => {
  const { name, description, image, brand, sku, price, categories } = req.body;

  // Validate input data
  if (!name || !description || !image || !brand || !sku || !price) {
    return res.status(400).json({ error: 'Kunde inte lägga till produkten. Kontrollera din input.' });
  }

  // Convert categories array to a comma-separated string
  const categoriesString = categories && Array.isArray(categories) ? categories.join(', ') : '';

  // Insert product into the database
  const query = `
    INSERT INTO products (title, description, image, brand, sku, price, slug, categories)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const slug = name.toLowerCase().replace(/ /g, '-'); // Generate a slug from the product name

  db.run(
    query,
    [name, description, image, brand, sku, price, slug, categoriesString],
    function (err) {
      if (err) {
        console.error('Failed to insert product:', err.message);
        return res.status(500).json({ error: 'Kunde inte lägga till produkten.' });
      }

      console.log('New product added with ID:', this.lastID);
      res.status(201).json({ message: 'Product added successfully', id: this.lastID }); // Respond to the client
    }
  );
});

module.exports = router;
