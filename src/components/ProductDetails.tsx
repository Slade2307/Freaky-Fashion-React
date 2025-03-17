import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductDetails.css";

// Product Type
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sku: string;
  imageUrl?: string;
  publishDate: string;
  slug: string;
}

function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        if (!res.ok) throw new Error("Failed to fetch related products");
        const data: Product[] = await res.json();
        // Filter out the current product from related products
        setRelatedProducts(data.filter((p) => p.slug !== slug));
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    })();
  }, [slug]);

  if (loading) return <div className="product-details">Loading...</div>;
  if (!product) return <div className="product-details">Product not found.</div>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <button className="slick-prev-custom">&#10094;</button>, // ◀ Left Arrow
    nextArrow: <button className="slick-next-custom">&#10095;</button>, // ▶ Right Arrow
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };
  

  return (
    <div className="product-details">
      <div className="product-main">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p><strong>Price:</strong> {product.price} SEK</p>
          <button className="add-to-cart">Lägg i varukorg</button>
        </div>
      </div>
      
      <h3 className="related-title">Liknande produkter</h3>
      <Slider {...settings} className="related-products">
        {relatedProducts.map((relProduct) => (
          <div key={relProduct.id} className="related-product">
            <img src={relProduct.imageUrl} alt={relProduct.name} />
            <p>{relProduct.name}</p>
            <p>{relProduct.price} SEK</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProductDetails;