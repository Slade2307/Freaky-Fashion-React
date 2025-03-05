"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const router = express_1.default.Router();
// Connect to SQLite database
const db = new sqlite3_1.default.Database("./db/products.db", (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    }
    else {
        console.log("Connected to the SQLite database.");
    }
});
// **Fix router.get()**
router.get("/products/api", (req, res) => {
    const query = "SELECT title, price, sku, categories FROM products";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Failed to retrieve products:", err.message);
            res.status(500).json({ error: "Failed to retrieve products" });
            return;
        }
        res.json(rows);
    });
});
// **Fix router.post()**
router.post("/products", (req, res) => {
    const { name, description, image, brand, sku, price, categories } = req.body;
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
exports.default = router;
