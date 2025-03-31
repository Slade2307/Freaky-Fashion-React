// -----------------------------------------------------------------------------
// Cart Page Component
// Renders the shopping cart with quantity controls, total price, and checkout link
// -----------------------------------------------------------------------------

import React from "react";
// 📦 React importeras så att vi kan använda JSX och bygga komponenter (components)
// JSX = HTML-liknande kod inuti JavaScript

import { Link } from "react-router-dom";
// 📍 Link är en React-komponent som låter oss navigera mellan sidor utan att ladda om sidan
// Det kommer från "react-router" (ett routing-bibliotek)

import { useCart } from "../Cart/CartContext";
// 🛒 useCart är en custom hook = funktion som ger tillgång till globala värden
// Den ger oss tillgång till t.ex. cart, updateQuantity, removeFromCart

import Header from "../../components/Header";
import Footer from "../../components/Footer";
// 🧱 Återanvändbara layoutkomponenter – toppen och botten av sidan (header/footer)

import "./Cart.css";
// 🎨 CSS-styling specifikt för denna sida

// -----------------------------------------------------------------------------
// Cart Component – Shows products added to the shopping cart
// -----------------------------------------------------------------------------

const Cart: React.FC = () => {
  // 🧠 Här använder vi destrukturering för att plocka ut funktioner och data från context
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <>
      {/* 🔼 Visar sidans toppnavigering */}
      <Header searchTerm="" onSearchChange={() => {}} />

      <section className="cart-page">
        <h1>Varukorgen</h1>

        {/* 📭 Om varukorgen är tom visas ett meddelande */}
        {cart.length === 0 ? (
          <p className="empty-cart">Din varukorg är tom.</p>
        ) : (
          // 📋 Annars visas produkterna i en tabell
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
              {/* 🔁 Loopa genom alla produkter i varukorgen */}
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="cart-product">
                    {/* 🖼️ Visar produktens bild och namn */}
                    <img src={item.imageUrl} alt={item.name} className="cart-image" />
                    <span>{item.name}</span>
                  </td>
                  <td>
                    {/* 🔢 Inputfält för att ändra antal */}
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) => {
                        const value = Math.max(1, Number(e.target.value));
                        // 🛡️ Säkerställer att antal inte blir mindre än 1
                        updateQuantity(item.id, value);
                        // 🔄 Anropar funktionen som uppdaterar antalet i context (globalt)
                      }}
                    />
                  </td>
                  <td>{item.price} SEK</td>
                  <td>{(item.price * item.quantity).toFixed(2)} SEK</td>
                  <td>
                    {/* 🗑️ Knapp för att ta bort en produkt från varukorgen */}
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 💳 Om det finns produkter visas totalsumma och "Till kassan"-knapp */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <h2>Totalt: {getTotalPrice()} SEK</h2>
            <Link to="/checkout" className="checkout-btn">
              Till kassan
            </Link>
          </div>
        )}
      </section>

      {/* 🔽 Visar sidfoten längst ner */}
      <Footer />
    </>
  );
};

export default Cart;
// 📤 Exporterar Cart-komponenten så att andra filer kan importera och använda den
