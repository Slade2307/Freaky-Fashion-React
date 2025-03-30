// -----------------------------------------------------------------------------
// src/pages/Cart/CartItem.tsx
// Renders a single cart item with quantity input and remove button
// -----------------------------------------------------------------------------

// This line brings in React so we can build components.
import React from "react";

// This line imports the "useCart" hook from your CartContext file. 
// useCart gives you access to the cart — like what's in the cart, and functions like add/remove items.
import { useCart } from "./CartContext"; // Adjust the path if your file is in a different folder



// Define the structure (or shape) of a single item in the cart
type CartItemType = {
  id: number;             // Unique ID for the product
  name: string;           // Product name
  price: number;          // Price of one item
  quantity: number;       // How many the user wants
  imageUrl?: string;      // (Optional) Image of the product
};

// -----------------------------------------------------------------------------
// Define what the CartItem component should receive as input (properties)
// -----------------------------------------------------------------------------

// This interface describes what data the CartItem component needs as a "prop" (input).
// It expects an object called "item" that must follow the CartItemType structure.
interface CartItemProps {
  item: CartItemType; // A single product in the cart
}

// The CartItem component shows one item in the shopping cart.
const CartItem: React.FC<CartItemProps> = ({ item }) => {
  // Get cart functions to update quantity or remove item
  const { updateQuantity, removeFromCart } = useCart();

  // Runs when user changes quantity
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Number(e.target.value)); // Avoid 0 or negative numbers
    updateQuantity(item.id, newQuantity); // Update cart with new quantity
  };

  return (
    <div className="cart-item">
      {/* Product image (or "no image" if missing) */}
      <div className="cart-item-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <div className="no-image">No image</div>
        )}
      </div>

      {/* Product name, price, quantity input, and remove button */}
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

          {/* Button to remove this item from cart */}
          <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;


