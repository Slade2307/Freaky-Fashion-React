import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css"; // Import your CSS file

// ✅ Define the correct product type
interface Product {
  id: number;
  title: string;
  price: number;
  brand: string;
  slug: string;
  image: string;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]); // ✅ Use Product[]

  // Fetch products from the backend
  useEffect(() => {
    fetch("http://localhost:3000/api/products") // Adjust the URL to your backend API
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Product[]) => setProducts(data)) // ✅ Type assertion for fetched data
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      {/* Header */}
      <header>
        <Link to="/">
          <div className="logo-container">
            <img src="/images/fashion-dude.png" alt="Freaky Fashion Logo" className="logo" />
          </div>
        </Link>

        <div className="search-container">
          <form className="search-form">
            <input type="text" placeholder="Search..." className="search-input" />
            <button type="submit" className="search-button">Search</button>
          </form>
          <div className="icons">
            <img src="/images/heart.png" alt="Favorites" className="icon" />
            <img src="/images/shopping-cart.png" alt="Cart" className="icon" />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav>
        <ul>
          <li><a href="#home">Nyheter</a></li>
          <li><a href="#about">Kategorier</a></li>
          <li><a href="#contact">Topplistan</a></li>
          <li><a href="#contact">Rea</a></li>
          <li><a href="#contact">Kampanjer</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="hero">
        <div className="text-container">
          <h2>Embrace Your Unique Style</h2>
          <p>Discover the latest trends and make them your own.</p>
        </div>
        <div className="hero-image">
          <img src="/images/style.jpg" alt="Style Image" />
        </div>
      </section>

      {/* Products */}
      <section id="products">
        <h2>Our Products</h2>
        <div className="product-container">
          {products.length === 0 ? (
            <p>Loading products...</p>
          ) : (
            products.map((product) => (
              <div className="product-item" key={product.id}>
                <div className="badge">NYHET</div>
                <Link to={`/product/${product.slug}`}>
                  <img src={`/${product.image.replace(/\\/g, "/")}`} alt={product.title} />
                </Link>
                <div className="wishlist-icon"><img src="/images/heart.png" alt="wishlist" /></div>
                <div className="product-details">
                  <span className="product-title">{product.title}</span>
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <span className="product-brand">{product.brand}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-sections">
            <div className="shopping-section">
              <h3>Shopping</h3>
              <ul>
                <li><a href="#">Vinterjackor</a></li>
                <li><a href="#">Pufferjackor</a></li>
                <li><a href="#">Kappa</a></li>
                <li><a href="#">Trenchcoats</a></li>
              </ul>
            </div>
            <div className="mina-sidor-section">
              <h3>Mina Sidor</h3>
              <ul>
                <li><a href="#">Mina Ordrar</a></li>
                <li><a href="#">Mitt Konto</a></li>
              </ul>
            </div>
            <div className="kundtjanst-section">
              <h3>Kundtjänst</h3>
              <ul>
                <li><a href="#">Returpolicy</a></li>
                <li><a href="#">Integritetspolicy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="footer-copyright">&copy; 2024 Freaky Fashion</p>
      </footer>
    </div>
  );
};

export default Home;
