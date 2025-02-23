const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const productRoutes = require('./routes/index'); // Assuming the product route is in 'routes/index.js'
app.use(express.static(path.join(__dirname, 'public')));



// Set up EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Connect to SQLite database
const db = new sqlite3.Database("./db/products.db", (err) => {
  if (err) {
    console.error("Error opening database: " + err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Define route to fetch products from the database
app.get("/", (req, res) => {
  const sql = "SELECT * FROM products";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("Error retrieving products from the database");
    } else {
      res.render("index", { products: rows });
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
