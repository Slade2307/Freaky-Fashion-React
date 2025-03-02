import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";

const router = express.Router();

// Connect to SQLite database
const db = new sqlite3.Database("./db/products.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// **Fix router.get()**
router.get("/products/api", (req: Request, res: Response) => {
  const query = "SELECT title, price, sku, categories FROM products";

  db.all(query, [], (err, rows: any[]) => {
    if (err) {
      console.error("Failed to retrieve products:", err.message);
      res.status(500).json({ error: "Failed to retrieve products" });
      return;
    }
    res.json(rows);
  });
});

// **Fix router.post()**
router.post("/products", (req: Request, res: Response) => {
  const { name, description, image, brand, sku, price, categories } = req.body as {
    name: string;
    description: string;
    image: string;
    brand: string;
    sku: string;
    price: number;
    categories?: string[];
  };

  // Validate input data
  if (!name || !description || !image || !brand || !sku || !price) {
    res.status(400).json({ error: "Invalid product data." });
    return;
  }

  const categoriesString = categories ? categories.join(", ") : "";
  const query = `
    INSERT INTO products (title, description, image, brand, sku, price, slug, categories)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const slug = name.toLowerCase().replace(/ /g, "-");

  db.run(query, [name, description, image, brand, sku, price, slug, categoriesString], function (err) {
    if (err) {
      console.error("Failed to insert product:", err.message);
      res.status(500).json({ error: "Could not add product." });
      return;
    }

    console.log("New product added with ID:", this.lastID);
    res.status(201).json({ message: "Product added successfully", id: this.lastID });
  });
});

export default router;
