// -----------------------------------------------------------------------------
// App.tsx
// Main application file with route definitions and shared layout components
// -----------------------------------------------------------------------------


// Import routing tools from react-router-dom:
// - Routes: wraps all routes (pages)
// - Route: defines individual routes (like "/cart")
// - Navigate: allows redirects (like from /admin to /admin/products)
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
// ⬆️ Sidhuvud: sökfält, logo osv

import Hero from './components/Hero';
// 🖼️ Stora bilden/bannern på startsidan (ofta reklam eller introduktion)

import ProductGrid from './components/ProductGrid';
// 🛍️ Rutnät som visar alla produkter på startsidan

import Footer from './components/Footer';
// ⬇️ Sidfoten längst ner

// Import admin page components
import ProductsList from './pages/Admin/ProductsList';
// 👨‍💼 Admin-sida som visar alla produkter (med redigera / ta bort)

import NewProduct from './pages/Admin/NewProduct';
// ➕ Admin-sida för att lägga till en ny produkt

// Import cart-related components
import Cart from './pages/Cart/Cart';
import { CartProvider } from './pages/Cart/CartContext';

// Import checkout and product detail pages
import Checkout from './pages/Checkout/Checkout';
// ✅ Sidan där användaren betalar och fyller i sin info

import ProductDetail from './pages/ProductDetail/ProductDetail';
// 🔍 Enskild produktsida (visas när man klickar på en produkt)

// Import global CSS styles
import './App.css';

// -----------------------------------------------------------------------------
// App Component (själva grundstrukturen för hela React-appen)
// -----------------------------------------------------------------------------

function App() {
  // 🧠 useState lagrar sökordet som skrivs i sökfältet
  const [searchTerm, setSearchTerm] = useState('');

  return (
    // 🧃 CartProvider omringar allt så att alla sidor har tillgång till varukorgens innehåll
    <CartProvider>
      <Routes>
        {/* ---------------------------------------------------------------------
          🏠 HOME ROUTE – Startsidan visas här
        --------------------------------------------------------------------- */}
        <Route
          path="/"
          element={
            <>
              {/* 📤 Skickar in sökord och uppdateringsfunktion till Header */}
              <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <Hero />
              {/* 🔎 Skickar sökord till ProductGrid så den bara visar matchande produkter */}
              <ProductGrid searchTerm={searchTerm} />
              <Footer />
            </>
          }
        />

        {/* ---------------------------------------------------------------------
          🚪 Redirect från /admin till /admin/products
        --------------------------------------------------------------------- */}
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />

        {/* ---------------------------------------------------------------------
          🔧 ADMIN ROUTES – Produkthantering
        --------------------------------------------------------------------- */}
        <Route path="/admin/products" element={<ProductsList />} /> {/* Visar alla produkter */}
        <Route path="/admin/product/new" element={<NewProduct />} /> {/* Lägg till ny produkt */}

        {/* ---------------------------------------------------------------------
          🛒 CART ROUTE – visar kundvagnen
        --------------------------------------------------------------------- */}
        <Route path="/cart" element={<Cart />} />

        {/* ---------------------------------------------------------------------
          💳 CHECKOUT ROUTE – slutför köp
        --------------------------------------------------------------------- */}
        <Route path="/checkout" element={<Checkout />} />

        {/* ---------------------------------------------------------------------
          🔍 PRODUCT DETAIL ROUTE – visar enskild produkt via slug
        --------------------------------------------------------------------- */}
        <Route path="/product/:slug" element={<ProductDetail />} />

        {/* ---------------------------------------------------------------------
          🚫 404 ROUTE – om ingen sida matchar
        --------------------------------------------------------------------- */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
// 📤 Exporterar App-komponenten så att den kan användas i index.tsx och starta hela appen
