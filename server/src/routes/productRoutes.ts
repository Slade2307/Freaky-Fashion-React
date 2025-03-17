/***************************************************************************** 
 *                          productRoutes.ts
 * 
 * This file handles all product-related CRUD operations, including image 
 * upload via Multer and serving local images as full URLs. It also introduces
 * "quantity" for shopping-cart compatibility.
 * 
 * Approx line count ~272 to preserve your original structure and comments. 
 *****************************************************************************/

import { Router, Request, Response } from 'express';
import multer, { StorageEngine } from 'multer';
import path from 'path';
import { initDB } from '../db';

/*****************************************************************************
 * Interface for partial product updates, supporting the shopping cart's 
 * "quantity" field.
 *****************************************************************************/
interface ProductUpdateBody {
  name?: string;
  description?: string;
  price?: number;
  sku?: string;
  imageUrl?: string;   // External image link
  imagePath?: string;  // We store final local path (if file is uploaded)
  publishDate?: string;
  slug?: string;
  quantity?: number;   // For cart support
}

/*****************************************************************************
 * Configuring Multer for 'product-images' directory. 
 * 
 * We use a custom filename format: 
 * "YYYY-MM-DD_HH.MM_originalName.ext" (no random suffix).
 *****************************************************************************/
const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'product-images');
  },
  filename: (req, file, cb) => {
    // Extract extension, e.g. ".png"
    const ext = path.extname(file.originalname);

    // Base name (no extension), removing spaces
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_');

    // Build date/time: e.g. "2025-03-14_13.44"
    const now = new Date();
    const dateString = now.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}.${minutes}`;

    // Combine: "YYYY-MM-DD_HH.MM_originalName.ext"
    cb(null, `${dateString}_${timeString}_${baseName}${ext}`);
  },
});
const upload = multer({ storage });

/*****************************************************************************
 * Helper: generateSlug()
 * Creates a URL-friendly slug from a product name if user doesn't provide it.
 *****************************************************************************/
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/*****************************************************************************
 * Helper: transformImageUrl(product)
 * If the product has a local "imagePath" starting with "/product-images",
 * we create a full URL in "imageUrl" so the frontend can display it.
 *****************************************************************************/
function transformImageUrl(product: any): any {
  if (!product || !product.imagePath) return product;
  
  // If it’s a local path in product-images
  if (product.imagePath.startsWith('/product-images')) {
    product.imageUrl = `http://localhost:3000${product.imagePath}`;
  }
  // If it’s already an external URL
  else if (product.imagePath.startsWith('http')) {
    product.imageUrl = product.imagePath;
  }

  return product;
}

/***************************************************************************** 
 *  GET /api/products 
 *  Lists all products, including "quantity" for cart usage (default or stored).
 *  The front-end sees "imageUrl" if available. 
 *****************************************************************************/
async function getAllProducts(req: Request, res: Response): Promise<void> {
  try {
    const db = await initDB();

    // Some schemas store 'quantity' in DB for inventory or default cart usage
    // If your DB doesn't have a 'quantity' column, set it to 1 as default.
    const products = await db.all(`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        sku, 
        publishDate, 
        slug, 
        imagePath,
        quantity
      FROM products
    `);

    // Map each to transform local image path -> full URL
    const transformed = products.map(transformImageUrl);
    res.json(transformed);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

/***************************************************************************** 
 *  GET /api/products/:slug 
 *  Returns a single product. The 'quantity' might be used for cart default.
 *****************************************************************************/
async function getProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const db = await initDB();

    // We select all columns (including quantity if present).
    const product = await db.get(`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        sku, 
        publishDate, 
        slug, 
        imagePath, 
        quantity
      FROM products
      WHERE slug = ?
    `, [slug]);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const transformed = transformImageUrl(product);
    res.json(transformed);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

/***************************************************************************** 
 *  POST /api/products
 *  Creates a new product. If a file is uploaded, we store local path; 
 *  if a user typed an external URL, we store that in 'imagePath'.
 *****************************************************************************/
async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const {
      name,
      description,
      price,
      sku,
      imageUrl,
      publishDate,
      slug,
      quantity,
    } = req.body;

    // If user uploaded a file, build local path. Otherwise, use external URL if any.
    let finalImagePath: string = '';
    // @ts-ignore: 'req.file' is added by Multer.
    if (req.file) {
      finalImagePath = '/product-images/' + req.file.filename;
    } else if (imageUrl && imageUrl.trim() !== '') {
      finalImagePath = imageUrl.trim();
    }

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Auto-generate slug if missing
    let finalSlug = slug || generateSlug(name);

    const db = await initDB();
    const result = await db.run(
      `INSERT INTO products 
       (name, description, price, sku, imagePath, publishDate, slug, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || '',
        price || 0,
        sku || '',
        finalImagePath,
        publishDate || '',
        finalSlug,
        quantity || 1, // default quantity 1 if not specified
      ]
    );

    // Return newly created product
    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    const transformed = transformImageUrl(newProduct);
    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

/***************************************************************************** 
 *  PUT /api/products/:slug 
 *  Updates an existing product. 
 *  If user provides new 'imageUrl', we store that in 'imagePath'. 
 *  Also updates 'quantity' if used for inventory or default cart usage.
 *****************************************************************************/
async function updateProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const {
      name,
      description,
      price,
      sku,
      imageUrl,
      publishDate,
      quantity,
    } = req.body;

    let finalImagePath = '';
    if (imageUrl && imageUrl.trim() !== '') {
      finalImagePath = imageUrl.trim();
    }

    const db = await initDB();

    // If finalImagePath is '', we keep the old image. 
    // Otherwise, update it.
    const result = await db.run(
      `UPDATE products
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           price = COALESCE(?, price),
           sku = COALESCE(?, sku),
           imagePath = CASE WHEN ? != '' THEN ? ELSE imagePath END,
           publishDate = COALESCE(?, publishDate),
           quantity = COALESCE(?, quantity)
       WHERE slug = ?`,
      [
        name,
        description,
        price,
        sku,
        finalImagePath,
        finalImagePath,
        publishDate,
        quantity,
        slug,
      ]
    );

    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found or no changes made' });
      return;
    }

    const updatedProduct = await db.get(
      'SELECT * FROM products WHERE slug = ?',
      [slug]
    );
    const transformed = transformImageUrl(updatedProduct);
    res.json(transformed);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

/***************************************************************************** 
 *  DELETE /api/products/:slug
 *  Removes a product from the database entirely.
 *****************************************************************************/
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

/***************************************************************************** 
 *  SETUP ROUTER
 *****************************************************************************/
const router = Router();

/*****************************************************************************
 *  /api/products
 *****************************************************************************/
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', upload.single('imageFile'), createProduct);
router.put('/:slug', updateProductBySlug);
router.delete('/:slug', deleteProductBySlug);

export default router;

/***************************************************************************** 
 * End of productRoutes.ts 
 *****************************************************************************/
