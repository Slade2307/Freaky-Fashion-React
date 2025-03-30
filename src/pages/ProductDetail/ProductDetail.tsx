// -----------------------------------------------------------------------------
// src/pages/ProductDetail/ProductDetail.tsx
// Displays detailed view of a single product with image thumbnails and carousel
// -----------------------------------------------------------------------------

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./ProductDetail.css";

// -----------------------------------------------------------------------------
// TypeScript Interface: Defines the structure of a Product object
// This is NOT real data — it's just a description TypeScript uses to check types
// -----------------------------------------------------------------------------

interface Product {
  id: number;            // Product ID (must be a number)
  slug: string;          // URL-safe product name, e.g. "grey-rug"
  name: string;          // Display name shown in the UI
  description: string;   // Description text
  price: number;         // Price in number format (e.g. 499)

  // Optional images (question mark means they’re not required)
  imageUrl?: string;     // Main product image
  imageUrl2?: string;    // Extra images (hover, gallery, etc.)
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
}


// -----------------------------------------------------------------------------
// ProductDetail Component – Shows one product with info, images, and suggestions
// -----------------------------------------------------------------------------

function ProductDetail() {
  // 🧾 Get the "slug" from the URL (e.g. /product/soft-grey-rug → "soft-grey-rug")
  const { slug } = useParams<{ slug: string }>();

  // 🧠 Create memory (state) to hold and update values in the component

  const [product, setProduct] = useState<Product | null>(null); // Current product info
  const [mainImage, setMainImage] = useState<string>("");       // Main image URL
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // Related products list. // 🔹 The empty array [] means: "Start with no related products yet"
  const [loading, setLoading] = useState(true);                 // Loading state (true when fetching)
  const [error, setError] = useState("");                       // Error message if something fails
  const [justAdded, setJustAdded] = useState(false);            // Show "added to cart" animation

  const { addToCart } = useCart(); // Get the addToCart function from Cart Context

  // ---------------------------------------------------------------------------
  // 1) Fetch the current product using the slug from the URL
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!slug) return; // Stop if no slug found

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${slug}`, { mode: "cors" });
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);

        const data: Product = await res.json(); // Convert response to Product object
        setProduct(data);                       // Save product info to state
        setMainImage(data.imageUrl || "");      // Set the main image (fallback to "")
      } catch (err: any) {
        setError(err.message);                  // Save error message if something fails
      } finally {
        setLoading(false);                      // Turn off loading spinner
      }
    };

    fetchProduct();
  }, [slug]); 

  // ---------------------------------------------------------------------------
  // 2) Fetch related products (excluding the current one)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!product) return;

    const fetchAllProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", { mode: "cors" });
        if (!res.ok) throw new Error(`Failed to fetch all products: ${res.status} ${res.statusText}`);

        const allProducts: Product[] = await res.json();

        // Filter out the current product
        const others = allProducts.filter((p) => p.id !== product.id);

        // Randomize and select max 5 products
        const randomSubset = others.sort(() => 0.5 - Math.random()).slice(0, 5);

        setRelatedProducts(randomSubset); // Save related products to state
      } catch (err: any) {
        console.error("Error fetching related products:", err.message);
      }
    };

    fetchAllProducts();
  }, [product]);

  // ---------------------------------------------------------------------------
  // 3) Add product to cart when button is clicked
  // ---------------------------------------------------------------------------
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({ ...product, quantity: 1 }); // Add product to cart with quantity 1
    setJustAdded(true);                     // Show ✔ checkmark

    // Hide checkmark after 2 seconds
    setTimeout(() => setJustAdded(false), 2000);
  };

  // ---------------------------------------------------------------------------
  // 4) Get all product images (ignore empty ones)
  // ---------------------------------------------------------------------------
  const allImages = [
    product?.imageUrl,
    product?.imageUrl2,
    product?.imageUrl3,
    product?.imageUrl4,
    product?.imageUrl5,
  ].filter(Boolean) as string[]; // Only keep defined image URLs

  // Generate items for the related products carousel
  const carouselItems = relatedProducts.map((prod) => (
    <Link
      key={prod.id}
      to={`/product/${prod.slug}`}
      className="alice-carousel-item"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <img
        src={prod.imageUrl || "/placeholder.png"}
        alt={prod.name}
        className="alice-carousel-img"
      />
      <h4>{prod.name}</h4>
      <p>{prod.price} SEK</p>
    </Link>
  ));

  // ---------------------------------------------------------------------------
  // 5) Handle loading, error or product not found state
  // ---------------------------------------------------------------------------
  if (loading) return <div className="product-detail">Laddar produkt...</div>;
  if (error) return <div className="product-detail">Fel: {error}</div>;
  if (!product) return <div className="product-detail">Ingen produkt hittades.</div>;

  // ---------------------------------------------------------------------------
  // 6) Main layout of the product detail page
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* Top header bar */}
      <Header searchTerm="" onSearchChange={() => {}} />

      {/* Main product section */}
      <section className="product-detail">
        {/* Left: Main product image */}
        <div className="product-detail-image">
          {mainImage ? (
            <img src={mainImage} alt={product.name} />
          ) : (
            <div className="no-image">Ingen bild</div>
          )}
        </div>

        {/* Right: Info, price, description, button */}
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price} SEK</p>
          <p className="product-description">{product.description}</p>

          {/* Add to cart button with optional checkmark animation */}
          <button
            className={`add-to-cart-btn ${justAdded ? "added" : ""}`}
            onClick={handleAddToCart}
          >
            {justAdded ? (
              <>
                <span className="checkmark">✔</span> Tillagd i kundvagn
              </>
            ) : (
              "Lägg i varukorg"
            )}
          </button>

          {/* Thumbnails below if there are extra images */}
          {allImages.length > 1 && (
            <div className="product-thumbnails">
              {allImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="product-thumb"
                  onClick={() => setMainImage(url)} // Change main image on click
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related product carousel */}
      <section className="related-products">
        <h2>Liknande produkter</h2>
        {relatedProducts.length === 0 ? (
          <p>Inga relaterade produkter att visa.</p>
        ) : (
          <AliceCarousel
            items={carouselItems}
            autoPlay
            autoPlayInterval={3000}
            infinite
            disableDotsControls={false}
            disableButtonsControls={false}
            responsive={{
              0: { items: 1 },
              600: { items: 2 },
              800: { items: 3 },
              1200: { items: 5 },
            }}
          />
        )}
      </section>

      {/* Footer at the bottom */}
      <Footer />
    </>
  );
}

export default ProductDetail;


