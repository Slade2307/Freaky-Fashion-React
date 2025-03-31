/*****************************************************************************
 * 📦 productRoutes.ts
 * 
 * Här hanteras alla CRUD-operationer för produkter (Create, Read, Update, Delete)
 * 👉 Vi kan även ladda upp bilder (via Multer) och koppla produkter till en kvantitet.
 *****************************************************************************/

// 🚀 Express router & typer för request/response
import { Router, Request, Response } from 'express';     

// 🖼️ Multer används för att hantera bilduppladdning
import multer, { StorageEngine } from 'multer';          

// 🔌 Hämtar funktion för att koppla till databasen
import { initDB } from '../db';                          


/*****************************************************************************
 * ⚙️ Multer-setup: Vart bilder ska sparas och vad de ska heta
 *****************************************************************************/

const storage: StorageEngine = multer.diskStorage({
  // 📂 Välj mapp för bilder
  destination: (req, file, cb) => {
    cb(null, 'product-images');
  },
  // 🧾 Skapa unikt filnamn så att inte gamla filer skrivs över
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });


/*****************************************************************************
 * 🧪 Helper: generateSlug()
 * Skapar en URL-vänlig "slug" av produktnamn
 *****************************************************************************/
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')       // 🧹 Ta bort specialtecken
    .replace(/[\s_-]+/g, '-')       // 🔁 Byt ut mellanslag & _ till bindestreck
    .replace(/^-+|-+$/g, '');       // ✂️ Ta bort bindestreck i början/slutet
}


/*****************************************************************************
 * 🖼️ Helper: transformMultipleImages(product)
 * Omvandlar lokala sökvägar till fullständiga bild-URLs
 *****************************************************************************/
function transformMultipleImages(product: any): any {
  if (!product) return product;

  const fields = ["imagePath", "imagePath2", "imagePath3", "imagePath4", "imagePath5"];

  fields.forEach((field) => {
    if (product[field]) {
      const urlField = field.replace("Path", "Url");
      // 🌍 Om det är en lokal sökväg → lägg till localhost
      if (product[field].startsWith('/product-images')) {
        product[urlField] = `http://localhost:3000${product[field]}`;
      }
      // 🌐 Om det redan är en full URL → behåll den
      else if (product[field].startsWith('http')) {
        product[urlField] = product[field];
      }
    }
  });

  return product;
}


/***************************************************************************** 
 * 📥 GET /api/products 
 * Hämtar alla produkter, sorterade efter sortOrder
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

    const transformed = products.map(transformMultipleImages); // 🔁 Gör om bildsökvägar
    res.json(transformed); // 📤 Skicka till klient
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}

/***************************************************************************** 
 * 📥 GET /api/products/:slug 
 * Hämtar en specifik produkt via dess slug
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
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}

/***************************************************************************** 
 * ➕ POST /api/products
 * Skapar en ny produkt
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

    // 📷 Hantera filuppladdning ELLER extern bildlänk
    // @ts-ignore: Multer lägger till "file"
    if (req.file) {
      finalImagePath = "/product-images/" + req.file.filename;
    } else if (imageUrl && imageUrl.trim() !== "") {
      finalImagePath = imageUrl.trim();
    }

    if (!name) {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    const finalSlug = slug || generateSlug(name); // 🔧 Skapa slug om den saknas

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

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);
    const transformed = transformMultipleImages(newProduct);

    res.status(201).json(transformed);
  } catch (error) {
    console.error('❌ Error adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

/***************************************************************************** 
 * ✏️ PUT /api/products/:slug 
 * Uppdaterar en befintlig produkt
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
      imageUrl2,
      imageUrl3,
      imageUrl4,
      imageUrl5,
      publishDate,
      quantity,
      sortOrder,
    } = req.body;

    // 💡 Hjälpfunktion för att rensa tomma bildfält
    function toFinalPath(url?: string): string {
      return url && url.trim() !== '' ? url.trim() : '';
    }
    const finalImagePath  = toFinalPath(imageUrl);
    const finalImagePath2 = toFinalPath(imageUrl2);
    const finalImagePath3 = toFinalPath(imageUrl3);
    const finalImagePath4 = toFinalPath(imageUrl4);
    const finalImagePath5 = toFinalPath(imageUrl5);

    const db = await initDB();

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

    const updatedProduct = await db.get('SELECT * FROM products WHERE slug = ?', [slug]);
    const transformed = transformMultipleImages(updatedProduct);
    res.json(transformed);
  } catch (error) {
    console.error('❌ Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
}

/***************************************************************************** 
 * 🗑️ DELETE /api/products/:slug
 * Tar bort en produkt
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
    console.error('❌ Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}

/***************************************************************************** 
 * 🚦 ROUTER SETUP
 * Kopplar samman funktionerna med rätt URL-endpoints
 *****************************************************************************/
const router = Router();

router.get('/', getAllProducts);                                // Hämta alla
router.get('/:slug', getProductBySlug);                         // Hämta en
router.post('/', upload.single('imageFile'), createProduct);    // Skapa ny
router.put('/:slug', updateProductBySlug);                      // Uppdatera
router.delete('/:slug', deleteProductBySlug);                   // Radera

export default router; // 📦 Exportera så vi kan använda det i vår server
