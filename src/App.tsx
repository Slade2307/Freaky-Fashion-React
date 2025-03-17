import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";

// Import your admin pages
import ProductsList from "./pages/Admin/ProductsList";
import NewProduct from "./pages/Admin/NewProduct";

// Import your Cart page & CartProvider
import Cart from "./pages/Cart/Cart";
import { CartProvider } from "./pages/Cart/CartContext";

import "./App.css";

function App() {
  // Maintain search state for filtering products on the home page
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <CartProvider> 
      {/* ✅ Wrap inside a fragment */}
      <>
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <Routes>
          {/* HOME ROUTE */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <ProductGrid searchTerm={searchTerm} />
                <Footer />
              </>
            }
          />

          {/* PRODUCT DETAILS ROUTE */}
          <Route path="/product/:slug" element={<ProductDetails />} />

          {/* REDIRECT /admin TO /admin/products */}
          <Route path="/admin" element={<Navigate to="/admin/products" replace />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin/products" element={<ProductsList />} />
          <Route path="/admin/product/new" element={<NewProduct />} />

          {/* CART ROUTE */}
          <Route path="/cart" element={<Cart />} />

          {/* OPTIONAL: 404 Not Found Route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </>
    </CartProvider>
  );
}

export default App;
