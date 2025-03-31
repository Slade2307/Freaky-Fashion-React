// -----------------------------------------------------------------------------
// src/pages/Checkout/Checkout.tsx
// Renders the checkout page with customer form and order summary
// -----------------------------------------------------------------------------

import { useState } from "react"; 
// 📦 useState är en "hook" (inbyggd funktion i React) som låter oss lagra och ändra värden i komponenten.

import { useCart } from "../Cart/CartContext";
// 🛒 useCart är vår "shoppingkorg-hook" – den ger oss tillgång till cart-data från Context.

import "./Checkout.css";
// 🎨 Importerar CSS-styling som gäller för kassasidan (checkout)

// -----------------------------------------------------------------------------
// Type Definitions (used locally for cart calculation)
// -----------------------------------------------------------------------------

type CartItem = {
  id: number;           // unikt ID för varje produkt
  name: string;         // produktens namn
  price: number;        // styckpris
  quantity: number;     // antal produkter av denna typ
  imageUrl?: string;    // valfri bild (kan vara undefined)
};

// -----------------------------------------------------------------------------
// Checkout Component (själva sidan "Kassan")
// -----------------------------------------------------------------------------

function Checkout() {
  const { cart } = useCart(); 
  // 🛒 Här hämtar vi varukorgen från Context så vi kan visa den på kassan-sidan

  // ---------------------------------------------------------------------------
  // 🧠 Formulär-fält som lagrar det användaren skriver in
  // useState låter oss "komma ihåg" det användaren skriver
  // ---------------------------------------------------------------------------

  const [name, setName] = useState("");       
  const [email, setEmail] = useState("");     
  const [address, setAddress] = useState(""); 
  const [phone, setPhone] = useState("");     


  // ---------------------------------------------------------------------------
  // 🚚 Val för frakt och betalning
  // ---------------------------------------------------------------------------

  const [shippingMethod, setShippingMethod] = useState("standard"); 
  const [paymentMethod, setPaymentMethod] = useState("card");       

  // 🧮 Räknar ut totalt antal produkter och totala priset (före frakt)
  const totalItems = cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  // ✉️ Hanterar när formuläret skickas in
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Hindrar sidan från att laddas om
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
        {/* -------------------------------------------
            📝 VÄNSTER: Kundens formulär
        -------------------------------------------- */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Kunduppgifter</h2>

          {/* 🧑 Namn */}
          <label htmlFor="name">Namn:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* 📧 E-post */}
          <label htmlFor="email">E-post:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🏠 Adress */}
          <label htmlFor="address">Adress:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />

          {/* 📞 Telefon */}
          <label htmlFor="phone">Telefon:</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          {/* 🚚 Fraktalternativ – radioknappar */}
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

          {/* 💳 Betalmetod */}
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

          {/* ✅ Slutför köp-knapp */}
          <button type="submit" className="checkout-button">
            Slutför köp
          </button>
        </form>

        {/* -------------------------------------------
            🧾 HÖGER: Orderöversikt
        -------------------------------------------- */}
        <div className="checkout-summary">
          <h2>Orderöversikt</h2>

          {/* 📦 Lista på produkter och totalsumma */}
          <div className="summary-list">
            {cart.map((item) => (
              <div key={item.id} className="summary-row">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} SEK</span>
              </div>
            ))}
          </div>

          {/* 📬 Visar frakt + total kostnad inkl frakt */}
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
// 📤 Exporterar denna komponent så den kan användas i andra delar av appen
