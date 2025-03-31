// -----------------------------------------------------------------------------
// src/pages/Cart/CartItem.tsx
// 🧩 Visar EN vara i varukorgen – med bild, namn, antal och ta bort-knapp
// -----------------------------------------------------------------------------


// 📦 Importerar React så vi kan använda JSX och bygga komponenter
import React from "react";


// 🧠 useCart = custom hook som ger oss tillgång till varukorgens data och funktioner
// T.ex. ändra antal, ta bort vara, hämta pris etc.
import { useCart } from "./CartContext"; // Anpassa sökvägen om filen flyttas



// -----------------------------------------------------------------------------
// 📐 TYPE: CartItemType – beskriver hur en vara i varukorgen ska se ut
// -----------------------------------------------------------------------------
// Det är som ett "kontrakt" som säger: varje vara måste ha id, namn, pris m.m.
type CartItemType = {
  id: number;             // Unikt ID (t.ex. 101)
  name: string;           // Namnet på produkten
  price: number;          // Pris per styck
  quantity: number;       // Hur många användaren vill ha
  imageUrl?: string;      // (valfritt) Bild på produkten
};


// -----------------------------------------------------------------------------
// 📐 INTERFACE: CartItemProps – vad komponenten behöver som "prop" (in-data)
// -----------------------------------------------------------------------------
// Vi säger att CartItem-komponenten förväntar sig ett objekt som följer CartItemType
interface CartItemProps {
  item: CartItemType; // Produkten som ska visas
}


// -----------------------------------------------------------------------------
// 🧩 CartItem Component
// Visar en vara i varukorgen med bild, namn, pris och möjligheten att ändra antal eller ta bort den
// -----------------------------------------------------------------------------
// React.FC betyder att detta är en "functional component"
const CartItem: React.FC<CartItemProps> = ({ item }) => {
  // 🧠 useCart ger oss tillgång till funktionerna från context
  const { updateQuantity, removeFromCart } = useCart();

  // 🔁 När man ändrar antalet i inputfältet
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Undvik att skriva 0 eller minus
    updateQuantity(item.id, newQuantity); // Uppdatera antalet i varukorgen
  };

  return (
    <div className="cart-item">
      {/* 📸 Bild på produkten (eller "No image" om ingen bild finns) */}
      <div className="cart-item-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <div className="no-image">No image</div>
        )}
      </div>

      {/* 🛍️ Info om produkten + möjlighet att ändra antal eller ta bort */}
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p>Price: {item.price} SEK</p>

        <div className="cart-item-actions">
          {/* 🔢 Inputfält för att skriva in antal */}
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={handleQuantityChange}
          />

          {/* ❌ Knapp för att ta bort produkten från varukorgen */}
          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// Exporterar komponenten så att andra filer kan använda <CartItem />
export default CartItem;
