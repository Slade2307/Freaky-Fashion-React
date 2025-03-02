import express, { Request, Response, NextFunction } from "express";
import path from "path";
import sqlite3 from "sqlite3";
import productRoutes from "./routes/index"; // ✅ Import product routes
import adminRoutes from "./routes/admin"; // ✅ Import admin routes

const app = express();
const PORT = 3000;

// ✅ Ensure Express finds `views/`
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // ⬅️ Ensure views are correctly referenced

// ✅ Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// ✅ Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to SQLite database with proper error handling
const db = new sqlite3.Database("./db/products.db", (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// ✅ Fetch all products and render `index.ejs`
app.get("/", (req: Request, res: Response) => {
  const sql = "SELECT * FROM products";

  db.all(sql, [], (err, rows: any[]) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.status(500).send("Error retrieving products from the database");
    }
    res.render("index", { products: rows });
  });
});

// ✅ Mount routes
app.use("/", productRoutes);
app.use("/admin", adminRoutes);

// ✅ Handle 404 errors with a proper error message
app.use((req: Request, res: Response, next: NextFunction) => {
  console.warn(`⚠️ 404 Not Found: ${req.originalUrl}`);
  res.status(404).render("error", { message: "Page not found" });
});

// ✅ Graceful shutdown to close database connection
process.on("SIGINT", () => {
  console.log("🚦 Shutting down server...");
  db.close((err) => {
    if (err) {
      console.error("❌ Error closing the database:", err.message);
    } else {
      console.log("✅ Database connection closed.");
    }
    process.exit(0);
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
