// -----------------------------------------------------------------------------
// src/pages/Cart/CartItem.tsx
// Renders a single cart item with quantity input and remove button
// -----------------------------------------------------------------------------

import React from "react";
import { useCart } from "./CartContext"; // Adjust path if needed

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

// If not imported from context, define the shape of a cart item
type CartItemType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

interface CartItemProps {
  item: CartItemType;
}

// -----------------------------------------------------------------------------
// CartItem Component
// -----------------------------------------------------------------------------

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  // Handle quantity input change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {/* Show image if available, fallback if not */}
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <div className="no-image">No image</div>
        )}
      </div>
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <p>Price: {item.price} SEK</p>

        <div className="cart-item-actions">
          {/* Quantity input */}
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={handleQuantityChange}
          />

          {/* Remove button */}
          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
