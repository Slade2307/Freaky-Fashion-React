import express, { Request, Response, NextFunction } from "express";
import path from "path";
import sqlite3 from "sqlite3";
import cors from "cors"; // Enable CORS for React requests
import productRoutes from "./routes/products"; // Import product routes
import adminRoutes from "./routes/admin"; // Import admin routes

const app = express();
const PORT = 3000;

// ✅ Enable CORS (Allow React frontend to communicate with backend)
app.use(cors());

// ✅ Middleware to parse incoming JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to SQLite database with proper error handling
const db = new sqlite3.Database(path.join(__dirname, "../db/products.db"), (err) => {
  if (err) {
    console.error("❌ Error opening database:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// ✅ API Route for Fetching All Products
app.get("/api/products", (req: Request, res: Response) => {
  const sql = "SELECT * FROM products";

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("❌ Database Error:", err.message);
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    // ✅ Fix Image Path for Frontend
    const updatedRows = rows.map((product) => ({
      ...product,
      image: product.image.replace(/\\/g, "/"), // Fix backslashes in image paths
    }));

    console.log("✅ Products fetched:", updatedRows);
    res.json(updatedRows);
  });
});

// ✅ Mount admin routes
app.use("/admin", adminRoutes);

// ✅ Serve Static Files (React Frontend)
const buildPath = path.join(__dirname, "../todo/dist"); // Make sure this path exists!
app.use(express.static(buildPath));

// ✅ Catch-All Route (For React Frontend)
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ✅ Handle 404 errors with a proper error message
app.use((req: Request, res: Response, next: NextFunction) => {
  console.warn(`⚠️ 404 Not Found: ${req.originalUrl}`);
  res.status(404).json({ error: "Page not found" });
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
