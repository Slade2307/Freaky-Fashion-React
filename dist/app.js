"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const index_1 = __importDefault(require("./routes/index")); // ✅ Import product routes
const admin_1 = __importDefault(require("./routes/admin")); // ✅ Import admin routes
const app = (0, express_1.default)();
const PORT = 3000;
// ✅ Ensure Express finds `views/`
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views")); // ⬅️ Ensure views are correctly referenced
// ✅ Serve static files from the "public" directory
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// ✅ Middleware to parse incoming JSON and URL-encoded data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ Connect to SQLite database with proper error handling
const db = new sqlite3_1.default.Database("./db/products.db", (err) => {
    if (err) {
        console.error("❌ Error opening database:", err.message);
    }
    else {
        console.log("✅ Connected to SQLite database.");
    }
});
// ✅ Fetch all products and render `index.ejs`
app.get("/", (req, res) => {
    const sql = "SELECT * FROM products";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("❌ Database Error:", err.message);
            return res.status(500).send("Error retrieving products from the database");
        }
        res.render("index", { products: rows });
    });
});
// ✅ Mount routes
app.use("/", index_1.default);
app.use("/admin", admin_1.default);
// ✅ Handle 404 errors with a proper error message
app.use((req, res, next) => {
    console.warn(`⚠️ 404 Not Found: ${req.originalUrl}`);
    res.status(404).render("error", { message: "Page not found" });
});
// ✅ Graceful shutdown to close database connection
process.on("SIGINT", () => {
    console.log("🚦 Shutting down server...");
    db.close((err) => {
        if (err) {
            console.error("❌ Error closing the database:", err.message);
        }
        else {
            console.log("✅ Database connection closed.");
        }
        process.exit(0);
    });
});
// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
