// -----------------------------------------------------------------------------
// Cart Page Component
// Renders the shopping cart with quantity controls, total price, and checkout link
// -----------------------------------------------------------------------------

import React from "react";
import { Link } from "react-router-dom";

// Cart context for managing cart actions and state
import { useCart } from "../Cart/CartContext";

// Layout components
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Styles for cart layout
import "./Cart.css";

// -----------------------------------------------------------------------------
// Cart Component
// -----------------------------------------------------------------------------

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <>
      {/* Header */}
      <Header searchTerm="" onSearchChange={() => {}} />

      <section className="cart-page">
        <h1>Varukorgen</h1>

        {/* Show message if cart is empty */}
        {cart.length === 0 ? (
          <p className="empty-cart">Din varukorg är tom.</p>
        ) : (
          // Display cart table if items exist
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
                    {/* Quantity input */}
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
                    {/* Remove button */}
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Show total and checkout if cart has items */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Totalt: {getTotalPrice()} SEK</h2>
            <Link to="/checkout" className="checkout-btn">
              Till kassan
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default Cart;
