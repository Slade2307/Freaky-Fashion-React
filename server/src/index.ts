// -----------------------------------------------------------------------------
// Basic Express Server Setup with CORS and Product API Routes
// -----------------------------------------------------------------------------


// -----------------------------------------------------------------------------
// 🔧 Importerar bibliotek vi behöver
// -----------------------------------------------------------------------------

import express, { Request, Response } from 'express'; 
// express = ett populärt backend framework för att bygga API:er och servrar
// Request & Response = typer för att hantera inkommande och utgående data

import cors from 'cors';
// cors = ett "middleware" (mellanlager) som tillåter kommunikation mellan frontend & backend
// ex: React på port 5173 pratar med server på port 3000

import productRouter from './routes/productRoutes';
// importerar våra produkt-relaterade API-routes (GET, POST osv.)


// -----------------------------------------------------------------------------
// 🚀 Skapar vår Express-app
// -----------------------------------------------------------------------------

const app = express();         // startar själva servern
const PORT = 3000;             // vilken port servern ska köras på (http://localhost:3000)


// -----------------------------------------------------------------------------
// 🔓 Aktiverar CORS så frontend kan prata med backend
// -----------------------------------------------------------------------------

// Gör det möjligt för webbsidan (React) att skicka/ta emot data från backend (Express)
app.use(
  cors({
    origin: "*", // tillåter alla domäner (ok i utveckling, ej i produktion!)
    methods: ["GET", "POST", "PUT", "DELETE"], // tillåtna HTTP-metoder
    allowedHeaders: ["Content-Type", "Authorization"], // vilka headers som får skickas med
  })
);


// -----------------------------------------------------------------------------
// 🧠 Middleware: Parsar JSON-data från frontend
// -----------------------------------------------------------------------------

// Gör så att vi kan använda t.ex. req.body i våra API-routes
// Detta låter servern förstå inkommande JSON (ex: när du skickar formulär från React)
app.use(express.json());


// -----------------------------------------------------------------------------
// 🖼️ Gör bilder publikt tillgängliga
// -----------------------------------------------------------------------------

// Låter oss visa produktbilder som sparats i mappen "product-images"
// Exempel: http://localhost:3000/product-images/jacka.jpg
app.use('/product-images', express.static('product-images'));


// -----------------------------------------------------------------------------
// 👋 Start-route för rotsidan "/"
// -----------------------------------------------------------------------------

// Om någon går till http://localhost:3000 visas detta meddelande
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the backend! Access the product API at /api/products');
});


// -----------------------------------------------------------------------------
// 🛒 Kopplar in våra produkt-routes
// -----------------------------------------------------------------------------

// Alla endpoints i productRoutes (t.ex. GET, POST) nås via /api/products
// Exempel: GET http://localhost:3000/api/products
app.use('/api/products', productRouter);


// -----------------------------------------------------------------------------
// ✅ Startar själva servern
// -----------------------------------------------------------------------------

// När servern körs visas ett meddelande i terminalen
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
