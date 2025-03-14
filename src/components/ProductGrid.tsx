// ProductGrid.tsx
import { useEffect, useState } from "react";
import "./ProductGrid.css";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl?: string; // Using imageUrl because backend aliases imagePath as imageUrl
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

  // Fetch products from the backend on mount
  useEffect(() => {
    (async () => {
      try {
        console.log("🔍 Fetching products from http://localhost:3000/api/products");
        const res = await fetch("http://localhost:3000/api/products", { mode: "cors" });
        console.log("✅ Response status:", res.status);
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }
        const data: Product[] = await res.json();
        console.log("📦 Fetched products:", data);
        setProducts(data);
      } catch (err: any) {
        console.error("🚨 Error fetching products:", err.message);
        console.error("🛠️ Stack Trace:", err.stack);
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

  if (loading) {
    return <section className="product-grid">Loading products...</section>;
  }

  if (error) {
    return <section className="product-grid">{error}</section>;
  }

  return (
    <section className="product-grid">
      {filteredProducts.map((product) => {
        // Build the final image source:
        // - If product.imageUrl starts with "/product-images/", prepend the backend URL.
        // - Otherwise, use product.imageUrl directly.
        const imageSrc = product.imageUrl
          ? product.imageUrl.startsWith('/product-images/')
            ? `http://localhost:3000${product.imageUrl}`
            : product.imageUrl
          : "";

        return (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {imageSrc ? (
                <img src={imageSrc} alt={product.name} />
              ) : (
                <div style={{ backgroundColor: "#ccc", height: "100%" }}>
                  No image
                </div>
              )}
            </div>
            <h2>{product.name}</h2>
            <p>{product.price} SEK</p>
          </div>
        );
      })}
    </section>
  );
}

export default ProductGrid;
