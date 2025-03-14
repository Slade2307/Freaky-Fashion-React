// server/src/index.ts
import express from 'express';
import cors from 'cors';
import productRouter from './routes/productRoutes';

const app = express();
const PORT = 3000;

// Enable CORS so the front end can make API requests
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Simple root route
app.get('/', (req, res) => {
  res.send('Hello from the backend! Access the product API at /api/products');
});

// Mount the products API
app.use('/api/products', productRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
