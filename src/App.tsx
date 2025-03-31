// -----------------------------------------------------------------------------
// App.tsx
// Main application file with route definitions and shared layout components
// -----------------------------------------------------------------------------

// Import routing tools from react-router-dom:
// - Routes: wraps all routes (pages)
// - Route: defines individual routes (like "/cart")
// - Navigate: allows redirects (like from /admin to /admin/products)
import { Routes, Route, Navigate } from 'react-router-dom';

// React hook to manage component state (like input fields, search, etc.)
import { useState } from 'react';

// Import reusable layout components
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

// Import admin page components
import ProductsList from './pages/Admin/ProductsList';
import NewProduct from './pages/Admin/NewProduct';

// Import cart-related components
import Cart from './pages/Cart/Cart';
import { CartProvider } from './pages/Cart/CartContext'; // Context for managing cart globally

// Import checkout and product detail pages
import Checkout from './pages/Checkout/Checkout';
import ProductDetail from './pages/ProductDetail/ProductDetail';

// Import global CSS styles
import './App.css';


// -----------------------------------------------------------------------------
// App Component
// -----------------------------------------------------------------------------

function App() {
  // Search input state for product filtering on homepage
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <CartProvider>
      <Routes>
        {/* ---------------------------------------------------------------------
          HOME ROUTE
        --------------------------------------------------------------------- */}
        <Route
          path="/"
          element={
            <>
              <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <Hero />
              <ProductGrid searchTerm={searchTerm} />
              <Footer />
            </>
          }
        />

        {/* ---------------------------------------------------------------------
          REDIRECT /admin TO /admin/products
        --------------------------------------------------------------------- */}
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />

        {/* ---------------------------------------------------------------------
          ADMIN ROUTES
        --------------------------------------------------------------------- */}
        <Route path="/admin/products" element={<ProductsList />} />
        <Route path="/admin/product/new" element={<NewProduct />} />

        {/* ---------------------------------------------------------------------
          CART ROUTE
        --------------------------------------------------------------------- */}
        <Route path="/cart" element={<Cart />} />

        {/* ---------------------------------------------------------------------
          CHECKOUT ROUTE
        --------------------------------------------------------------------- */}
        <Route path="/checkout" element={<Checkout />} />

        {/* ---------------------------------------------------------------------
          PRODUCT DETAIL ROUTE
        --------------------------------------------------------------------- */}
        <Route path="/product/:slug" element={<ProductDetail />} />

        {/* ---------------------------------------------------------------------
          404 NOT FOUND ROUTE
        --------------------------------------------------------------------- */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
