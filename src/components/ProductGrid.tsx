// src/components/ProductGrid.tsx 
import { useEffect, useState } from "react";
import { useCart } from "../pages/Cart/CartContext";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState<{ [key: number]: boolean }>({}); 
  // Tracks which product IDs were recently added

  const { addToCart } = useCart();

  // Fetch products on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", { mode: "cors" });
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter by search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <section className="product-grid">Loading products...</section>;
  if (error) return <section className="product-grid">{error}</section>;

  // Handle the "add to cart" click. Each click adds an extra quantity of 1.
  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    setJustAdded((prev) => ({ ...prev, [product.id]: true }));

    // Revert visual feedback after 2 seconds
    setTimeout(() => {
      setJustAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section className="product-grid">
      {filteredProducts.map((product) => {
        // Ensure correct local vs external image path
        const imageSrc = product.imageUrl?.startsWith("/product-images/")
          ? `http://localhost:3000${product.imageUrl}`
          : product.imageUrl || "";

        const isAdded = justAdded[product.id];

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
              className={`add-to-cart-btn ${isAdded ? "added" : ""}`}
              onClick={() => handleAddToCart(product)}
            >
              {isAdded ? (
                <>
                  <span className="checkmark">✔</span> Tillagd i kundvagn
                </>
              ) : (
                "Lägg i varukorg"
              )}
            </button>
          </div>
        );
      })}
    </section>
  );
}

export default ProductGrid;
