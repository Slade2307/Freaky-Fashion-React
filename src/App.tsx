// -----------------------------------------------------------------------------
// App.tsx
// Main application file with route definitions and shared layout components
// -----------------------------------------------------------------------------

import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

import ProductsList from './pages/Admin/ProductsList';
import NewProduct from './pages/Admin/NewProduct';

import Cart from './pages/Cart/Cart';
import { CartProvider } from './pages/Cart/CartContext';

import Checkout from './pages/Checkout/Checkout';
import ProductDetail from './pages/ProductDetail/ProductDetail';

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
