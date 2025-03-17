// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import ProductDetails from './components/ProductDetails';

// Import your admin pages
import ProductsList from './pages/Admin/ProductsList';
import NewProduct from './pages/Admin/NewProduct';

import './App.css';

function App() {
  // Maintain search state for filtering products on the home page
  const [searchTerm, setSearchTerm] = useState('');

  return (
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

      {/* ProductDetails Route */}
      <Route path="/product/:slug" element={<ProductDetails />} />

      {/* REDIRECT /admin TO /admin/products */}
      <Route path="/admin" element={<Navigate to="/admin/products" replace />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin/products" element={<ProductsList />} />
      <Route path="/admin/product/new" element={<NewProduct />} />

      {/* OPTIONAL: 404 Not Found Route */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default App;
