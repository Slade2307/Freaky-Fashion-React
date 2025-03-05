import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const db = new sqlite3.Database("./db/products.db", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

/* GET home page. */
router.get("/", (req: Request, res: Response) => {
  const query = "SELECT * FROM products";

  db.all(query, [], (err, rows: any[]) => {
    if (err) {
      console.error("Failed to retrieve products:", err.message);
      return res.status(500).send("Failed to retrieve products");
    }
    res.render("index", { title: "Freaky Fashion", products: rows }); // Pass products to EJS
  });
});

/* GET product details page by slug */
router.get("/product/:slug", (req: Request, res: Response) => {
  const productSlug: string = req.params.slug;

  // Fetch the product based on the slug from the database
  db.get("SELECT * FROM products WHERE slug = ?", [productSlug], (err, product: any) => {
    if (err || !product) {
      console.error("Product not found:", err ? err.message : "No product with that slug");
      return res.status(404).send("Product not found");
    }

    // Fetch similar products to display
    db.all("SELECT * FROM products WHERE slug != ? LIMIT 3", [productSlug], (err, similarProducts: any[]) => {
      if (err) {
        console.error("Failed to retrieve similar products:", err.message);
        return res.status(500).send("Failed to retrieve similar products");
      }
      res.render("product-details", { product, similarProducts }); // Pass data to product-details.ejs
    });
  });
});

export default router;
