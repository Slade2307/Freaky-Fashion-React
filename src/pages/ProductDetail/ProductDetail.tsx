// src/pages/ProductDetail/ProductDetail.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../Cart/CartContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./ProductDetail.css";

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;   // main image
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
}

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [justAdded, setJustAdded] = useState(false); 
  const { addToCart } = useCart(); 

  // 1) Fetch the current product
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${slug}`, { mode: "cors" });
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
        }
        const data: Product = await res.json();
        setProduct(data);

        // Default main image is imageUrl or blank
        setMainImage(data.imageUrl || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // 2) Fetch all products, exclude current, pick random subset
  useEffect(() => {
    if (!product) return;

    const fetchAllProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", { mode: "cors" });
        if (!res.ok) {
          throw new Error(`Failed to fetch all products: ${res.status} ${res.statusText}`);
        }
        const allProducts: Product[] = await res.json();

        // Filter out the current product
        const others = allProducts.filter((p) => p.id !== product.id);
        // Shuffle & pick up to 5
        const randomSubset = others.sort(() => 0.5 - Math.random()).slice(0, 5);
        setRelatedProducts(randomSubset);
      } catch (err: any) {
        console.error("Error fetching related products:", err.message);
      }
    };

    fetchAllProducts();
  }, [product]);

  if (loading) {
    return <div className="product-detail">Laddar produkt...</div>;
  }
  if (error) {
    return <div className="product-detail">Fel: {error}</div>;
  }
  if (!product) {
    return <div className="product-detail">Ingen produkt hittades.</div>;
  }

  // 3) Add to cart
  const handleAddToCart = () => {
    if (!product) return;
  
    addToCart({ ...product, quantity: 1 });
    setJustAdded(true);
  
    // Reset after 2 seconds
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };
  

  // Gather all non-empty images into an array for thumbnails
  const allImages = [
    product.imageUrl,
    product.imageUrl2,
    product.imageUrl3,
    product.imageUrl4,
    product.imageUrl5,
  ].filter(Boolean) as string[];

  // 4) Build carousel items for related products
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

  return (
    <>
      {/* Header with dummy props */}
      <Header
        searchTerm=""
        onSearchChange={() => {}}
      />

      {/* Main product detail section */}
      <section className="product-detail">
        <div className="product-detail-image">
          {mainImage ? (
            <img src={mainImage} alt={product.name} />
          ) : (
            <div className="no-image">Ingen bild</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price} SEK</p>
          <p className="product-description">{product.description}</p>
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


          {/* Thumbnails row if we have multiple images */}
          {allImages.length > 1 && (
            <div className="product-thumbnails">
              {allImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="product-thumb"
                  onClick={() => setMainImage(url)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Carousel section */}
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
              1024: { items: 3 },
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
