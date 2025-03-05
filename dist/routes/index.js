"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const router = express_1.default.Router();
const db = new sqlite3_1.default.Database("./db/products.db", (err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    }
    else {
        console.log("Connected to the SQLite database.");
    }
});
/* GET home page. */
router.get("/", (req, res) => {
    const query = "SELECT * FROM products";
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Failed to retrieve products:", err.message);
            return res.status(500).send("Failed to retrieve products");
        }
        res.render("index", { title: "Freaky Fashion", products: rows }); // Pass products to EJS
    });
});
/* GET product details page by slug */
router.get("/product/:slug", (req, res) => {
    const productSlug = req.params.slug;
    // Fetch the product based on the slug from the database
    db.get("SELECT * FROM products WHERE slug = ?", [productSlug], (err, product) => {
        if (err || !product) {
            console.error("Product not found:", err ? err.message : "No product with that slug");
            return res.status(404).send("Product not found");
        }
        // Fetch similar products to display
        db.all("SELECT * FROM products WHERE slug != ? LIMIT 3", [productSlug], (err, similarProducts) => {
            if (err) {
                console.error("Failed to retrieve similar products:", err.message);
                return res.status(500).send("Failed to retrieve similar products");
            }
            res.render("product-details", { product, similarProducts }); // Pass data to product-details.ejs
        });
    });
});
exports.default = router;
