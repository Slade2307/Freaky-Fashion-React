// -----------------------------------------------------------------------------
// CartContext.tsx
// This file keeps track of what's in the shopping cart
// -----------------------------------------------------------------------------

import { createContext, useContext, useState, ReactNode } from "react";

// createContext – lets us share data with many components (like the cart)
// useContext – lets us use that shared data
// useState – lets us save and change values (like item count)
// ReactNode – allows us to show child elements inside a component


// -----------------------------------------------------------------------------
// What a product in the cart looks like
// -----------------------------------------------------------------------------

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

// -----------------------------------------------------------------------------
// What the cart can do
// -----------------------------------------------------------------------------

type CartContextType = {
  cart: CartItem[];                         // List of items
  addToCart: (product: CartItem) => void;   // Add new item
  updateQuantity: (id: number, quantity: number) => void; // Change amount
  removeFromCart: (id: number) => void;     // Remove item
  clearCart: () => void;                    // Empty cart
  getTotalPrice: () => number;              // Total cost
};

// -----------------------------------------------------------------------------
// Create and set up the cart context
// -----------------------------------------------------------------------------

export const CartContext = createContext<CartContextType | undefined>(undefined);

// Wrap around your app so cart works everywhere
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]); // Start with an empty cart

  // Add item to cart (or increase quantity if already in cart)
  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...prevCart, product];
    });
  };

  // Change how many of an item there is
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  // Remove an item completely
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear all items from cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate the total price of all items
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Make all cart functions available to the app
  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// -----------------------------------------------------------------------------
// Custom hook to use the cart anywhere in the app
// -----------------------------------------------------------------------------

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
