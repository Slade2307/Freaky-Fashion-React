/*****************************************************************************
 *                          productRoutes.ts
 * 
 * This file handles all product-related CRUD operations, including image 
 * upload via Multer and serving local images as full URLs. It also introduces
 * "quantity" for shopping-cart compatibility.
 *****************************************************************************/

// Import Express router and types for request/response
import { Router, Request, Response } from 'express';     

// Import Multer (used for handling file uploads)
import multer, { StorageEngine } from 'multer';          

// Import your database connection function
import { initDB } from '../db';                          


/*****************************************************************************
 * Multer setup for file uploads
 *****************************************************************************/

const storage: StorageEngine = multer.diskStorage({
  // Set upload folder
  destination: (req, file, cb) => {
    cb(null, 'product-images');
  },
  // Create a unique filename to avoid overwriting
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });


/*****************************************************************************
 * Helper: generateSlug()
 *****************************************************************************/
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')       // remove special characters
    .replace(/[\s_-]+/g, '-')       // replace spaces and underscores with dashes
    .replace(/^-+|-+$/g, '');       // remove leading/trailing dashes
}


/*****************************************************************************
 * Helper: transformMultipleImages(product)
 *****************************************************************************/
function transformMultipleImages(product: any): any {
  if (!product) return product;

  const fields = ["imagePath", "imagePath2", "imagePath3", "imagePath4", "imagePath5"];

  fields.forEach((field) => {
    if (product[field]) {
      const urlField = field.replace("Path", "Url");
      // If local path, prefix it with server URL
      if (product[field].startsWith('/product-images')) {
        product[urlField] = `http://localhost:3000${product[field]}`;
      }
      // If it's already a full URL, keep it
      else if (product[field].startsWith('http')) {
        product[urlField] = product[field];
      }
    }
  });

  return product;
}


/***************************************************************************** 
 *  GET /api/products 
 *  Lists all products, ordering by sortOrder if it exists.
 *****************************************************************************/
async function getAllProducts(req: Request, res: Response): Promise<void> {
  try {
    const db = await initDB();
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
        imagePath2,
        imagePath3,
        imagePath4,
        imagePath5,
        quantity,
        sortOrder
      FROM products
      ORDER BY sortOrder
    `);

    // Convert image paths to full URLs
    const transformed = products.map(transformMultipleImages);

    res.json(transformed); // Send to client
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

/***************************************************************************** 
 *  GET /api/products/:slug 
 *****************************************************************************/
async function getProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;
    const db = await initDB();

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
        imagePath2,
        imagePath3,
        imagePath4,
        imagePath5,
        quantity,
        sortOrder
      FROM products
      WHERE slug = ?
    `, [slug]);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const transformed = transformMultipleImages(product);
    res.json(transformed);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

/***************************************************************************** 
 *  POST /api/products
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

    let finalImagePath = "";

    // Handle file upload OR use image URL from body
    // @ts-ignore: Multer adds `file` property
    if (req.file) {
      finalImagePath = "/product-images/" + req.file.filename;
    } else if (imageUrl && imageUrl.trim() !== "") {
      finalImagePath = imageUrl.trim();
    }

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    // Generate slug if not provided
    const finalSlug = slug || generateSlug(name);

    // Insert new product into DB
    const db = await initDB();
    const result = await db.run(`
      INSERT INTO products 
        (name, description, price, sku, imagePath, publishDate, slug, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      name,
      description || "",
      price || 0,
      sku || "",
      finalImagePath,
      publishDate || "",
      finalSlug,
      quantity || 1,
    ]);

    // Fetch the newly inserted product
    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    const transformed = transformMultipleImages(newProduct);

    res.status(201).json(transformed);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

/***************************************************************************** 
 *  PUT /api/products/:slug 
 *****************************************************************************/
async function updateProductBySlug(req: Request<{ slug: string }>, res: Response): Promise<void> {
  try {
    const { slug } = req.params;

    // Get updated values from request body
    const {
      name,
      description,
      price,
      sku,
      imageUrl,
      imageUrl2,
      imageUrl3,
      imageUrl4,
      imageUrl5,
      publishDate,
      quantity,
      sortOrder,
    } = req.body;

    // Helper to clean empty image URLs
    function toFinalPath(url?: string): string {
      return url && url.trim() !== '' ? url.trim() : '';
    }
    const finalImagePath  = toFinalPath(imageUrl);
    const finalImagePath2 = toFinalPath(imageUrl2);
    const finalImagePath3 = toFinalPath(imageUrl3);
    const finalImagePath4 = toFinalPath(imageUrl4);
    const finalImagePath5 = toFinalPath(imageUrl5);

    
    const db = await initDB();

    // Update product in the database (only if new value is provided)
    const result = await db.run(`
      UPDATE products
      SET name        = (?, name),
          description = COALESCE(?, description),
          price       = COALESCE(?, price),
          sku         = COALESCE(?, sku),

          imagePath   = CASE WHEN ? != '' THEN ? ELSE imagePath END,
          imagePath2  = CASE WHEN ? != '' THEN ? ELSE imagePath2 END,
          imagePath3  = CASE WHEN ? != '' THEN ? ELSE imagePath3 END,
          imagePath4  = CASE WHEN ? != '' THEN ? ELSE imagePath4 END,
          imagePath5  = CASE WHEN ? != '' THEN ? ELSE imagePath5 END,

          publishDate = COALESCE(?, publishDate),
          quantity    = COALESCE(?, quantity),
          sortOrder   = COALESCE(?, sortOrder)

      WHERE slug = ?
    `,
    [
      name,
      description,
      price,
      sku,

      finalImagePath,
      finalImagePath,
      finalImagePath2,
      finalImagePath2,
      finalImagePath3,
      finalImagePath3,
      finalImagePath4,
      finalImagePath4,
      finalImagePath5,
      finalImagePath5,

      publishDate,
      quantity,
      sortOrder,
      slug,
    ]);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Product not found or no changes made' });
      return;
    }    

    // Fetch updated product and return it
    const updatedProduct = await db.get('SELECT * FROM products WHERE slug = ?', [slug]);
    const transformed = transformMultipleImages(updatedProduct);
    res.json(transformed);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

/***************************************************************************** 
 *  DELETE /api/products/:slug
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

// Define API routes and attach the correct handler functions
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);
router.post('/', upload.single('imageFile'), createProduct);
router.put('/:slug', updateProductBySlug);
router.delete('/:slug', deleteProductBySlug);

// Export this router so it can be used in your server
export default router;
