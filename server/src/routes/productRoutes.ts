import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
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
  imageUrl?: string;   // The user might send an external URL here
  imagePath?: string;  // We store final path in the DB
  publishDate?: string;
  slug?: string;
}

// Setup Multer storage to save uploaded files to "product-images" folder.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'product-images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Helper function to generate a slug from a product name.
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with a single hyphen
    .replace(/^-+|-+$/g, '');  // Trim leading/trailing hyphens
}

// Utility: Transform product's imagePath to a full URL if needed.
function transformImageUrl(product: any): any {
  if (product.imageUrl && product.imageUrl.startsWith('/product-images')) {
    product.imageUrl = `http://localhost:3000${product.imageUrl}`;
  }
  return product;
}

// GET /api/products - list all products.
async function getAllProducts(req: Request, res: Response): Promise<void> {
  try {
    const db = await initDB();
    // Alias imagePath as imageUrl so the frontend sees "imageUrl"
    const products = await db.all(`
      SELECT
        id,
        name,
        description,
        price,
        sku,
        publishDate,
        slug,
        imagePath AS imageUrl
      FROM products
    `);
    // Transform each product's imageUrl if it's a local path.
    const transformedProducts = products.map(transformImageUrl);
    res.json(transformedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

// GET /api/products/:slug - get a single product by slug.
async function getProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const db = await initDB();
    // Alias imagePath as imageUrl here as well.
    let product = await db.get(`
      SELECT
        id,
        name,
        description,
        price,
        sku,
        publishDate,
        slug,
        imagePath AS imageUrl
      FROM products
      WHERE slug = ?
    `, [slug]);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    product = transformImageUrl(product);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

// POST /api/products - add a new product.
async function createProduct(req: Request<{}, any, ProductUpdateBody>, res: Response): Promise<void> {
  try {
    let {
      name,
      description,
      price,
      sku,
      imageUrl,
      publishDate,
      slug
    } = req.body;

    // Decide final imagePath to store in the DB.
    let finalImagePath = "";

    // If a file was uploaded, use local path.
    // @ts-ignore: req.file is added by Multer at runtime.
    if (req.file) {
      finalImagePath = "/product-images/" + req.file.filename;
    }
    // Else if user typed an external URL, use that.
    else if (imageUrl && imageUrl.trim() !== "") {
      finalImagePath = imageUrl.trim();
    }

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
      `INSERT INTO products (name, description, price, sku, imagePath, publishDate, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || "", price || 0, sku || "", finalImagePath, publishDate || "", slug]
    );
    const newProductId = result.lastID;

    // Return the newly inserted product, aliasing imagePath as imageUrl.
    let newProduct = await db.get(`
      SELECT
        id,
        name,
        description,
        price,
        sku,
        publishDate,
        slug,
        imagePath AS imageUrl
      FROM products
      WHERE id = ?
    `, [newProductId]);

    newProduct = transformImageUrl(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

// Wrap the createProduct route with Multer middleware to handle file uploads.
const createProductWithUpload = [upload.single('imageFile'), createProduct];

// PUT /api/products/:slug - update an existing product by slug (JSON body only).
async function updateProductBySlug(
  req: Request<{ slug: string }, any, ProductUpdateBody>,
  res: Response
): Promise<void> {
  try {
    const { slug } = req.params;
    const {
      name,
      description,
      price,
      sku,
      imageUrl,
      publishDate
    } = req.body;

    // If user sends a new external URL, store that in imagePath.
    let finalImagePath = "";
    if (imageUrl && imageUrl.trim() !== "") {
      finalImagePath = imageUrl.trim();
    }

    const db = await initDB();
    const result = await db.run(
      `UPDATE products
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           sku = COALESCE(?, sku),
           imagePath = CASE WHEN ? != '' THEN ? ELSE imagePath END,
           publishDate = COALESCE(?, publishDate)
       WHERE slug = ?`,
      [
        name,
        description,
        price,
        sku,
        finalImagePath, // condition
        finalImagePath, // new value
        publishDate,
        slug
      ]
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found or no changes made' });
      return;
    }

    let updatedProduct = await db.get(`
      SELECT
        id,
        name,
        description,
        price,
        sku,
        publishDate,
        slug,
        imagePath AS imageUrl
      FROM products
      WHERE slug = ?
    `, [slug]);

    updatedProduct = transformImageUrl(updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

// DELETE /api/products/:slug - delete a product by slug.
async function deleteProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
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
}

const router = Router();
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', ...createProductWithUpload);
router.put('/:slug', updateProductBySlug);
router.delete('/:slug', deleteProductBySlug);

export default router;
