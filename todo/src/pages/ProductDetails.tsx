import React from "react";
import { useParams } from "react-router-dom";
import "../styles/ProductDetails.css"; // Import your CSS file

const ProductDetails = () => {
  // Simulating product data (in a real app, fetch from backend)
  const { productId } = useParams();
  const product = {
    title: "Cool Jacket",
    price: 49.99,
    image: "/product-images/img_herr_.jpg",
  };

  const similarProducts = [
    { title: "Stylish Coat", price: 59.99, slug: "stylish-coat", image: "/images/winter-collection.jpg" },
    { title: "Summer Dress", price: 39.99, slug: "summer-dress", image: "/images/summer-collection.jpg" }
  ];

  return (
    <div>
      {/* Product Details Section */}
      <section id="product-details">
        <div className="product-details-container">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-info">
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">${product.price}</p>
            <button className="add-to-cart-button">Lägg i varukorg</button>
          </div>
        </div>
      </section>

      {/* Similar Products Section */}
      <section id="similar-products">
        <h2>Liknande produkter</h2>
        <div className="similar-products-container">
          {similarProducts.map((similarProduct, index) => (
            <div className="similar-product-item" key={index}>
              <a href={`/product/${similarProduct.slug}`}>
                <img src={similarProduct.image} alt={similarProduct.title} />
              </a>
              <div className="similar-product-details">
                <h3 className="similar-product-title">{similarProduct.title}</h3>
                <p className="similar-product-price">${similarProduct.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
