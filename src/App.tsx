// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';

// Import your admin pages
import ProductsList from './pages/Admin/ProductsList';
import NewProduct from './pages/Admin/NewProduct';

// Import your Cart page & CartProvider
import Cart from './pages/Cart/Cart';
import { CartProvider } from './pages/Cart/CartContext';

// NEW: Import Checkout page
import Checkout from './pages/Checkout/Checkout';

// NEW: Import Product Detail page
import ProductDetail from './pages/ProductDetail/ProductDetail';

import './App.css';

function App() {
  // Maintain search state for filtering products on the home page
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <CartProvider>
      <Routes>
        {/* HOME ROUTE */}
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

        {/* REDIRECT /admin TO /admin/products */}
        <Route path="/admin" element={<Navigate to="/admin/products" replace />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin/products" element={<ProductsList />} />
        <Route path="/admin/product/new" element={<NewProduct />} />

        {/* CART ROUTE */}
        <Route path="/cart" element={<Cart />} />
        
        {/* NEW: CHECKOUT ROUTE */}
        <Route path="/checkout" element={<Checkout />} />

        {/* NEW: PRODUCT DETAIL ROUTE */}
        <Route path="/product/:slug" element={<ProductDetail />} />

        {/* OPTIONAL: 404 Not Found Route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </CartProvider>
  );
}

export default App;
