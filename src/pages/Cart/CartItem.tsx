// src/pages/Cart/CartItem.tsx
import React from "react";
import { useCart } from "./CartContext"; // or "../CartContext", depending on folder structure

// If you have a separate 'CartItem' type declared in CartContext, import it here.
// Otherwise, define it inline:
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

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value));
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
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
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={handleQuantityChange}
          />
          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
