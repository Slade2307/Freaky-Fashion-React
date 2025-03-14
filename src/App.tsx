// App.tsx

// 1) Import useState from React
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import './App.css';

function App() {
  // 2) Create a state for the search term
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      {/* 3) Pass searchTerm and setSearchTerm to Header */}
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <Hero />

      {/* 4) Pass searchTerm to ProductGrid so it can filter products */}
      <ProductGrid searchTerm={searchTerm} />

      <Footer />
    </>
  );
}

export default App;
