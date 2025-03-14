import { Router, Request, Response, RequestHandler } from 'express';
import { initDB } from '../db';

/**
 * Interface for a partial product update.
 * Allows updating any subset of the product fields.
 */
interface ProductUpdateBody {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  imageUrl?: string;
  publishDate?: string;
  slug?: string;
}

// Helper function to generate a slug from a product name.
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')    // Remove non-word characters
    .replace(/[\s_-]+/g, '-')    // Replace spaces/underscores with a hyphen
    .replace(/^-+|-+$/g, '');     // Trim leading/trailing hyphens
}

// GET /api/products - list all products.
const getAllProducts: RequestHandler = async (req, res) => {
  try {
    console.log("🛠️ GET /api/products request received.");

    const db = await initDB();
    const products = await db.all('SELECT * FROM products');

    console.log("📦 Sending products:", products);

    res.json(products);
  } catch (error) {
    console.error("🚨 Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


// GET /api/products/:slug - get a single product by slug.
const getProductBySlug: RequestHandler<{ slug: string }> = async (req, res) => {
  try {
    const { slug } = req.params;
    const db = await initDB();
    const product = await db.get('SELECT * FROM products WHERE slug = ?', [slug]);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// POST /api/products - add a new product.
const createProduct: RequestHandler<{}, any, ProductUpdateBody> = async (req, res) => {
  try {
    let { name, description, price, sku, imageUrl, publishDate, slug } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }
    // Auto-generate slug if not provided.
    if (!slug) {
      slug = generateSlug(name);
    }
    const db = await initDB();
    const result = await db.run(
      `INSERT INTO products (name, description, price, sku, imageUrl, publishDate, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, sku, imageUrl, publishDate, slug]
    );
    const newProductId = result.lastID;
    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [newProductId]);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};

// PUT /api/products/:slug - update an existing product by slug.
const updateProductBySlug: RequestHandler<{ slug: string }, any, ProductUpdateBody> = async (
  req,
  res
) => {
  try {
    const { slug } = req.params;
    const { name, description, price, sku, imageUrl, publishDate } = req.body;
    const db = await initDB();
    const result = await db.run(
      `UPDATE products
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           sku = COALESCE(?, sku),
           imageUrl = COALESCE(?, imageUrl),
           publishDate = COALESCE(?, publishDate)
       WHERE slug = ?`,
      [name, description, price, sku, imageUrl, publishDate, slug]
    );
    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found or no changes made' });
      return;
    }
    const updatedProduct = await db.get('SELECT * FROM products WHERE slug = ?', [slug]);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// DELETE /api/products/:slug - delete a product by slug.
const deleteProductBySlug: RequestHandler<{ slug: string }> = async (req, res) => {
  try {
    const { slug } = req.params;
    const db = await initDB();
    const result = await db.run('DELETE FROM products WHERE slug = ?', [slug]);
    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Assemble and mount all route handlers.
const router = Router();
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', createProduct);
router.put('/:slug', updateProductBySlug);
router.delete('/:slug', deleteProductBySlug);

export default router;
