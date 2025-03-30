// -----------------------------------------------------------------------------
// Basic Express Server Setup with CORS and Product API Routes
// -----------------------------------------------------------------------------

// Import Express framework and request/response types
import express, { Request, Response } from 'express';

// Import CORS middleware to allow frontend requests from different origins
import cors from 'cors';

// Import the product-related routes from your routes folder
import productRouter from './routes/productRoutes';

// Create the Express app
const app = express();

// Define the port the server will run on
const PORT = 3000;

// -----------------------------------------------------------------------------
// Enable CORS (Cross-Origin Resource Sharing)
// -----------------------------------------------------------------------------
// This allows your frontend (e.g., React app) to communicate with the backend
// even if they are hosted on different ports (like 5173 and 3000)
app.use(
  cors({
    origin: "*", // Allow requests from any domain (for development)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed request headers
  })
);

// -----------------------------------------------------------------------------
// Middleware to parse incoming JSON request bodies
// -----------------------------------------------------------------------------
// This allows you to access JSON data from the frontend using req.body
app.use(express.json());

// -----------------------------------------------------------------------------
// Serve static files (images) from the "product-images" folder
// -----------------------------------------------------------------------------
// Example: http://localhost:3000/product-images/shirt.jpg
app.use('/product-images', express.static('product-images'));

// -----------------------------------------------------------------------------
// Root route for quick testing
// -----------------------------------------------------------------------------
// This is just a friendly message when someone visits the root URL
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend! Access the product API at /api/products');
});

// -----------------------------------------------------------------------------
// Mount the product API routes under /api/products
// -----------------------------------------------------------------------------
// This means all routes defined in productRoutes.ts will start with /api/products
app.use('/api/products', productRouter);

// -----------------------------------------------------------------------------
// Start the server
// -----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
