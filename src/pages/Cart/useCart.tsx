// -----------------------------------------------------------------------------
// useCart.tsx
// Manages cart state globally using React Context
// -----------------------------------------------------------------------------

import { createContext, useContext, useState, ReactNode } from "react";

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

// Represents a product in the cart
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

// Represents the context value and its functions
type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
};

// -----------------------------------------------------------------------------
// Create CartContext
// -----------------------------------------------------------------------------

export const CartContext = createContext<CartContextType | undefined>(undefined);

// -----------------------------------------------------------------------------
// CartProvider
// Wraps the app and provides the cart functionality to all components
// -----------------------------------------------------------------------------

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Add product to cart, or update quantity if it already exists
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

  // Update quantity of a product in the cart
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  };

  // Remove a product from the cart by ID
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate the total price of all items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Provide all values/functions to context consumers
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
// useCart Hook
// Allows components to access cart context
// -----------------------------------------------------------------------------

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
