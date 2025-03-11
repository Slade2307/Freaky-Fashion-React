// Remove or comment out this line if you're not directly using React
// import React from 'react';

import Header from './components/Header';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <Hero />
      <ProductGrid />
      <Footer />
    </>
  );
}

export default App;
