// src/components/ProductGrid.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../pages/Cart/CartContext";
import "./ProductGrid.css";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl?: string;   // main image
  imageUrl2?: string;  // second image for hover
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
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <section className="product-grid">Loading products...</section>;
  if (error) return <section className="product-grid">{error}</section>;

  // Add to cart
  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    setJustAdded((prev) => ({ ...prev, [product.id]: true }));

    setTimeout(() => {
      setJustAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section className="product-grid">
      {filteredProducts.map((product) => {
        // Build main and hover image URLs (local or external)
        const mainSrc = product.imageUrl?.startsWith("/product-images/")
          ? `http://localhost:3000${product.imageUrl}`
          : product.imageUrl || "";

        const hoverSrc = product.imageUrl2?.startsWith("/product-images/")
          ? `http://localhost:3000${product.imageUrl2}`
          : product.imageUrl2 || "";

        const isAdded = justAdded[product.id];

        return (
          <div key={product.id} className="product-card">
            {/* Link around the image + name */}
            <Link to={`/product/${product.slug}`} className="product-link">
              <div className="image-wrapper">
                {/* Main image */}
                {mainSrc ? (
                  <img className="main-img" src={mainSrc} alt={product.name} />
                ) : (
                  <div className="no-image">No image</div>
                )}

                {/* Hover image if available */}
                {product.imageUrl2 && hoverSrc && (
                  <img className="hover-img" src={hoverSrc} alt={`${product.name} alt2`} />
                )}
              </div>
              <h2>{product.name}</h2>
            </Link>

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
