import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../Cart/CartContext"; // Adjust if your context path differs
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./Cart.css";

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <>
      {/* 1) Top-level fragment starts */}
      <Header searchTerm="" onSearchChange={() => {}} />

      <section className="cart-page">
        <h1>Varukorgen</h1>

        {cart.length === 0 ? (
          <p className="empty-cart">Din varukorg är tom.</p>
        ) : (
          <table className="cart-table">
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Antal</th>
                <th>Pris</th>
                <th>Totalt</th>
                <th>Åtgärder</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="cart-product">
                    <img src={item.imageUrl} alt={item.name} className="cart-image" />
                    <span>{item.name}</span>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => {
                        const value = Math.max(1, Number(e.target.value));
                        updateQuantity(item.id, value);
                      }}
                    />
                  </td>
                  <td>{item.price} SEK</td>
                  <td>{(item.price * item.quantity).toFixed(2)} SEK</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Totalt: {getTotalPrice()} SEK</h2>
            <Link to="/checkout" className="checkout-btn">
              Till kassan
            </Link>
          </div>
        )}
      </section>

      <Footer />
      {/* 2) Top-level fragment ends */}
    </>
  );
};

export default Cart;
