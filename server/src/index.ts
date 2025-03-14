import express, { Request, Response } from 'express';
import cors from 'cors';
import productRouter from './routes/productRoutes';

const app = express();
const PORT = 3000;

// Enable CORS so the front end can make API requests
app.use(
  cors({
    origin: "*", // Allow requests from any frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the "product-images" folder.
// This allows the front end to access local images via URLs like:
// http://localhost:3000/product-images/filename.jpg
app.use('/product-images', express.static('product-images'));

// Simple root route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend! Access the product API at /api/products');
});

// Mount the products API
app.use('/api/products', productRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
