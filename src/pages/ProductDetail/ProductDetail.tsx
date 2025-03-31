// -----------------------------------------------------------------------------
// src/pages/ProductDetail/ProductDetail.tsx
// Visar en enskild produkts detaljer som bilder, namn, pris, beskrivning m.m.
// -----------------------------------------------------------------------------

// 📦 React Hooks — useState = lagrar minne, useEffect = kör kod när sidan laddas
import { useEffect, useState } from "react";

// 🌐 useParams = hämtar texten från URL (ex: /product/matta → slug = "matta")
// Link = gör så vi kan klicka och byta sida utan att ladda om
import { useParams, Link } from "react-router-dom";

// 🛒 useCart = vår globala "kundvagn", här kan vi lägga till produkter
import { useCart } from "../Cart/CartContext";

// 🧱 Layout-komponenter (topp och botten på sidan)
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// 🎠 AliceCarousel = färdig kod för att visa ett bildspel med produkter
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";

// 🎨 CSS-stil för sidan
import "./ProductDetail.css";

// -----------------------------------------------------------------------------
// Typ-definition: hur en "Product" ska se ut (endast för TypeScript kontroll)
// -----------------------------------------------------------------------------

interface Product {
  id: number;            // Produktens unika ID (nummer)
  slug: string;          // URL-namn (t.ex. "mjuk-matta")
  name: string;          // Produktens visningsnamn
  description: string;   // Beskrivningstext
  price: number;         // Pris (i SEK som ett nummer)

  // ❓ Dessa är valfria (kan finnas, men måste inte)
  imageUrl?: string;     
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
  imageUrl5?: string;
}

// -----------------------------------------------------------------------------
// ProductDetail-komponenten — Huvudfunktionen som visar produktens sida
// -----------------------------------------------------------------------------

function ProductDetail() {
  // 🧠 Slug = produktens URL-namn (hämtas från länken)
  const { slug } = useParams<{ slug: string }>();

  // 🧠 useState = "spara och ändra värden"
  const [product, setProduct] = useState<Product | null>(null); // Just nu visade produkten
  const [mainImage, setMainImage] = useState<string>("");       // Stora bilden som visas
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // Produkter som liknar
  const [loading, setLoading] = useState(true);                 // Visar "laddar..." när vi hämtar data
  const [error, setError] = useState("");                       // Om något går fel, visa felmeddelande
  const [justAdded, setJustAdded] = useState(false);            // True i 2 sek efter klick på "Lägg i varukorg"

  // 🔌 Hämta funktionen "addToCart" från vår kundvagns-kod
  const { addToCart } = useCart();

  // ---------------------------------------------------------------------------
  // 1️⃣ Hämta aktuell produkt baserat på URL-slug
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${slug}`, { mode: "cors" });
        if (!res.ok) throw new Error(`Misslyckades att hämta: ${res.status}`);

        const data: Product = await res.json(); // 📥 Hämta produkt som JSON
        setProduct(data);                       // Spara produkten i minnet
        setMainImage(data.imageUrl || "");      // Visa första bilden (eller tom om ingen finns)
      } catch (err: any) {
        setError(err.message); // Visa felmeddelande
      } finally {
        setLoading(false); // Sluta visa "laddar..."
      }
    };

    fetchProduct();
  }, [slug]); // 🔁 Kör om slug ändras

  // ---------------------------------------------------------------------------
  // 2️⃣ Hämta relaterade produkter
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!product) return;

    const fetchAllProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products", { mode: "cors" });
        if (!res.ok) throw new Error(`Misslyckades att hämta produkter`);

        const allProducts: Product[] = await res.json();

        // 🧹 Ta bort produkten vi redan visar
        const others = allProducts.filter((p) => p.id !== product.id);

        // 🎲 Slumpa max 5 produkter att visa i karusellen
        const randomSubset = others.sort(() => 0.5 - Math.random()).slice(0, 5);
        setRelatedProducts(randomSubset);
      } catch (err: any) {
        console.error("Fel vid hämtning av relaterade produkter:", err.message);
      }
    };

    fetchAllProducts();
  }, [product]);

  // ---------------------------------------------------------------------------
  // 3️⃣ Lägg till produkt i varukorgen
  // ---------------------------------------------------------------------------
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({ ...product, quantity: 1 }); // 🛒 Lägg i varukorg (med 1 st)
    setJustAdded(true); // ✅ Visa checkmark

    // ⏱️ Dölj checkmark efter 2 sekunder
    setTimeout(() => setJustAdded(false), 2000);
  };

  // ---------------------------------------------------------------------------
  // 4️⃣ Samla alla bilder som inte är tomma
  // ---------------------------------------------------------------------------
  const allImages = [
    product?.imageUrl,
    product?.imageUrl2,
    product?.imageUrl3,
    product?.imageUrl4,
    product?.imageUrl5,
  ].filter(Boolean) as string[]; // Filtrera bort tomma

  // 🖼️ Skapa små klickbara kort för relaterade produkter
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
  // 5️⃣ Hantera laddning, fel eller om produkt inte finns
  // ---------------------------------------------------------------------------
  if (loading) return <div className="product-detail">Laddar produkt...</div>;
  if (error) return <div className="product-detail">Fel: {error}</div>;
  if (!product) return <div className="product-detail">Ingen produkt hittades.</div>;

  // ---------------------------------------------------------------------------
  // 6️⃣ Visa sidans innehåll (JSX)
  // ---------------------------------------------------------------------------
  return (
    <>
      {/* 🧱 Toppdel med logga/sökfält */}
      <Header searchTerm="" onSearchChange={() => {}} />

      {/* 🛍️ Produktdetaljer */}
      <section className="product-detail">
        {/* Vänster sida: Stora bilden */}
        <div className="product-detail-image">
          {mainImage ? (
            <img src={mainImage} alt={product.name} />
          ) : (
            <div className="no-image">Ingen bild</div>
          )}
        </div>

        {/* Höger sida: Namn, pris, beskrivning, knapp */}
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price} SEK</p>
          <p className="product-description">{product.description}</p>

          {/* Knapp: Lägg i varukorg */}
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

          {/* Småbilder om flera finns */}
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

      {/* 🎠 Relaterade produkter */}
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

      {/* 🔚 Footer längst ner */}
      <Footer />
    </>
  );
}

export default ProductDetail;
