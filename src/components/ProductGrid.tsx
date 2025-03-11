import React from "react";
import "./ProductGrid.css";

type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

const mockProducts: Product[] = [
  { id: 1, name: "Svart T-shirt", price: 99, imageUrl: "path-to-img" },
  { id: 2, name: "Vit T-shirt", price: 99, imageUrl: "path-to-img" },
  { id: 3, name: "Blå T-shirt", price: 99, imageUrl: "path-to-img" },
  // Add more products...
];

function ProductGrid() {
  return (
    <section className="product-grid">
      {mockProducts.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            {/* Replace with <img src={product.imageUrl} alt={product.name} /> */}
            [Image Placeholder]
          </div>
          <h2>{product.name}</h2>
          <p>{product.price} SEK</p>
        </div>
      ))}
    </section>
  );
}

export default ProductGrid;
