// src/components/ProductGrid.tsx

// Import necessary hooks, components, and styles
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../pages/Cart/CartContext";
import "./ProductGrid.css";

// Define the Product type (shape of product data)
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl?: string;   // main image
  imageUrl2?: string;  // second image (shown on hover)
  publishDate: string;
  slug: string;
};

// Props expected by this component (searchTerm from parent)
type ProductGridProps = {
  searchTerm: string;
};

function ProductGrid({ searchTerm }: ProductGridProps) {
  // Local state to store product data, loading, errors, and "just added" flags
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [justAdded, setJustAdded] = useState<{ [key: number]: boolean }>({});

  // Access addToCart function from CartContext
  const { addToCart } = useCart();

  // Fetch product data when component mounts
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", { mode: "cors" });
        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }
        const data: Product[] = await res.json(); // Parse JSON response
        setProducts(data); // Save products to state
      } catch (err: any) {
        setError(err.message); // Show any fetch error
      } finally {
        setLoading(false); // Stop loading state
      }
    })();
  }, []);

  // Filter products by the current search term
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading or error messages if needed
  if (loading) return <section className="product-grid">Loading products...</section>;
  if (error) return <section className="product-grid">{error}</section>;

  // Handle "Add to cart" action
  const handleAddToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 }); // Add product with quantity 1
    setJustAdded((prev) => ({ ...prev, [product.id]: true })); // Mark as added

    // Remove "added" highlight after 2 seconds
    setTimeout(() => {
      setJustAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section className="product-grid">
      {/* Loop through and render each filtered product */}
      {filteredProducts.map((product) => {
        // Prepare URLs for images (handle local or external sources)
        const mainSrc = product.imageUrl?.startsWith("/product-images/")
          ? `http://localhost:3000${product.imageUrl}`
          : product.imageUrl || "";

        const hoverSrc = product.imageUrl2?.startsWith("/product-images/")
          ? `http://localhost:3000${product.imageUrl2}`
          : product.imageUrl2 || "";

        const isAdded = justAdded[product.id]; // Check if recently added

        return (
          <div key={product.id} className="product-card">
            {/* Wrap image and product name in a link to the product page */}
            <Link to={`/product/${product.slug}`} className="product-link">
              <div className="image-wrapper">
                {/* Show main image or fallback if none */}
                {mainSrc ? (
                  <img className="main-img" src={mainSrc} alt={product.name} />
                ) : (
                  <div className="no-image">No image</div>
                )}

                {/* Show hover image if available */}
                {product.imageUrl2 && hoverSrc && (
                  <img className="hover-img" src={hoverSrc} alt={`${product.name} alt2`} />
                )}
              </div>
              <h2>{product.name}</h2>
            </Link>

            {/* Show product price */}
            <p>{product.price} SEK</p>

            {/* Add to cart button with feedback animation */}
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
