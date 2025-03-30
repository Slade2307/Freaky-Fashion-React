// -----------------------------------------------------------------------------
// src/pages/Checkout/Checkout.tsx
// Renders the checkout page with customer form and order summary
// -----------------------------------------------------------------------------

import { useState } from "react";
import { useCart } from "../Cart/CartContext";
import "./Checkout.css";

// -----------------------------------------------------------------------------
// Type Definitions (used locally for cart calculation)
// -----------------------------------------------------------------------------

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

// -----------------------------------------------------------------------------
// Checkout Component
// -----------------------------------------------------------------------------

function Checkout() {
  const { cart } = useCart();

 // -----------------------------------------------------------------------------
// Customer form fields — these store what the user types into the inputs - 
// useState lets your component remember a value and update it later.
// -----------------------------------------------------------------------------

const [name, setName] = useState("");       // Stores the "Namn" input
const [email, setEmail] = useState("");     // Stores the "E-post" input
const [address, setAddress] = useState(""); // Stores the "Adress" input
const [phone, setPhone] = useState("");     // Stores the "Telefon" input


// -----------------------------------------------------------------------------
// Selected options for shipping and payment
// -----------------------------------------------------------------------------

const [shippingMethod, setShippingMethod] = useState("standard"); // Default is "standard" shipping
const [paymentMethod, setPaymentMethod] = useState("card");       // Default is "card" payment


  // Calculate total items and total price
  const totalItems = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting order", {
      name,
      email,
      address,
      phone,
      shippingMethod,
      paymentMethod,
    });
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Kassan</h1>
      <p className="checkout-subtitle">Antal varor: {totalItems}</p>

      <div className="checkout-layout">
        {/* ---------------------------------------------------------------------
           LEFT: Checkout Form
        --------------------------------------------------------------------- */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Kunduppgifter</h2>

          <label htmlFor="name">Namn:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="email">E-post:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="address">Adress:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          <label htmlFor="phone">Telefon:</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <h3>Frakt</h3>
          <div className="shipping-methods">
            <label>
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
              />
              Standard (49 SEK)
            </label>
            <label>
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
              />
              Express (99 SEK)
            </label>
          </div>

          <h3>Betalning</h3>
          <div className="payment-methods">
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Kort
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="invoice"
                checked={paymentMethod === "invoice"}
                onChange={() => setPaymentMethod("invoice")}
              />
              Faktura
            </label>
          </div>

          <button type="submit" className="checkout-button">
            Slutför köp
          </button>
        </form>

        {/* ---------------------------------------------------------------------
           RIGHT: Order Summary
        --------------------------------------------------------------------- */}
        <div className="checkout-summary">
          <h2>Orderöversikt</h2>

          <div className="summary-list">
            {cart.map((item) => (
              <div key={item.id} className="summary-row">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} SEK</span>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <div className="summary-row">
              <span>Frakt:</span>
              <span>{shippingMethod === "express" ? "99.00" : "49.00"} SEK</span>
            </div>
            <div className="summary-row total">
              <strong>Totalt:</strong>
              <strong>
                {(
                  totalPrice +
                  (shippingMethod === "express" ? 99 : 49)
                ).toFixed(2)} SEK
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
