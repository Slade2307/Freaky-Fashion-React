// -----------------------------------------------------------------------------
// Cart Page Component
// Renders the shopping cart with quantity controls, total price, and checkout link
// -----------------------------------------------------------------------------

import React from "react";
// Lets us write components using JSX
// Example:
// const Hello = () => <h1>Hello world</h1>;

import { Link } from "react-router-dom";
// Lets us link to other pages without reloading the page
// Example:
// <Link to="/cart">Go to Cart</Link>



// Cart context for managing cart actions and state
import { useCart } from "../Cart/CartContext";
// 👆 useCart gives access to cart data and functions like addToCart()
// Example:
// const { cart, addToCart } = useCart();


// Layout components
import Header from "../../components/Header";
import Footer from "../../components/Footer";
// 👆 Reusable layout components for the top and bottom of the page
// Example:
// <Header /> shows the site's top navigation
// <Footer /> shows the footer at the bottom of the page


// Styles for cart layout
import "./Cart.css";

// -----------------------------------------------------------------------------
// Cart Component – Shows products added to the shopping cart
// -----------------------------------------------------------------------------

const Cart: React.FC = () => {
  // Get cart data and actions from context
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <>
      {/* Top of the page – site header */}
      <Header searchTerm="" onSearchChange={() => {}} />

      <section className="cart-page">
        <h1>Varukorgen</h1>

        {/* If cart is empty, show message */}
        {cart.length === 0 ? (
          <p className="empty-cart">Din varukorg är tom.</p>
        ) : (
          // If cart has items, show them in a table
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
              {/* Loop through all items in cart */}
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="cart-product">
                    {/* Product image and name */}
                    <img src={item.imageUrl} alt={item.name} className="cart-image" />
                    <span>{item.name}</span>
                  </td>
                  <td>
                    {/* Quantity input field */}
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => {
                        const value = Math.max(1, Number(e.target.value)); // Prevent values below 1
                        updateQuantity(item.id, value); // Update quantity in cart
                      }}
                    />
                  </td>
                  <td>{item.price} SEK</td>
                  <td>{(item.price * item.quantity).toFixed(2)} SEK</td>
                  <td>
                    {/* Remove product from cart */}
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* If cart has items, show total price and checkout button */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Totalt: {getTotalPrice()} SEK</h2>
            <Link to="/checkout" className="checkout-btn">
              Till kassan
            </Link>
          </div>
        )}
      </section>

      {/* Bottom of the page – site footer */}
      <Footer />
    </>
  );
};

export default Cart;

