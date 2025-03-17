// src/components/ProductGrid.tsx
import { useEffect, useState } from "react";
import { useCart } from "../pages/Cart/CartContext"; // Import cart context
import "./ProductGrid.css";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl?: string;
  publishDate: string;
  slug: string;
};

type ProductGridProps = {
  searchTerm: string;
};

function ProductGrid({ searchTerm }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { addToCart } = useCart(); // Use the cart context

  // Fetch products from the backend on mount
  useEffect(() => {
    (async () => {
      try {
        console.log("🔍 Fetching products from http://localhost:3000/api/products");
        const res = await fetch("http://localhost:3000/api/products", { mode: "cors" });

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }

        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        console.error("🚨 Error fetching products:", err.message);
        setError(`Error fetching products: ${err.message}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter products based on search term (case-insensitive)
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <section className="product-grid">Loading products...</section>;
  if (error) return <section className="product-grid">{error}</section>;

  return (
    <section className="product-grid">
      {filteredProducts.map((product) => {
        // Ensure correct image URL (local and external)
        const imageSrc = product.imageUrl?.startsWith("/product-images/")
          ? `http://localhost:3000${product.imageUrl}`
          : product.imageUrl || "";

        return (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {imageSrc ? (
                <img src={imageSrc} alt={product.name} />
              ) : (
                <div className="no-image">No image</div>
              )}
            </div>
            <h2>{product.name}</h2>
            <p>{product.price} SEK</p>
            <button
                className="add-to-cart-btn"
                onClick={() => addToCart({ ...product, quantity: 1 })} // Fix: Add quantity
              >
                Lägg i varukorg
              </button>

          </div>
        );
      })}
    </section>
  );
}

export default ProductGrid;
