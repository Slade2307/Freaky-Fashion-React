// -----------------------------------------------------------------------------
// useCart.tsx
// Manages cart state globally using React Context
// -----------------------------------------------------------------------------

import { createContext, useContext, useState, ReactNode } from "react";
// 🧠 Vi importerar React-verktyg (från frameworket React)
// - createContext: skapar en global "delad minnesplats"
// - useContext: används av komponenter för att läsa från minnet
// - useState: hook för att hantera lokalt state
// - ReactNode: typ för barnkomponenter (dvs innehåll inuti en komponent)

// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

// 📦 Vi skapar en typmall för en produkt i varukorgen
type CartItem = {
  id: number;           // unikt ID för produkten
  name: string;         // namn på produkten
  price: number;        // pris per styck
  quantity: number;     // hur många av denna produkt
  imageUrl?: string;    // (valfritt) bildlänk till produkten
};

// 📘 Typ för själva "systemet" (cart context) och vad det innehåller
type CartContextType = {
  cart: CartItem[];   // själva listan med produkter
  addToCart: (product: CartItem) => void;               // funktion för att lägga till
  updateQuantity: (id: number, quantity: number) => void; // ändra antal
  removeFromCart: (id: number) => void;                 // ta bort produkt
  clearCart: () => void;                                // töm hela varukorgen
  getTotalPrice: () => number;                          // räkna ut totalsumma
};

// -----------------------------------------------------------------------------
// Create CartContext
// -----------------------------------------------------------------------------

export const CartContext = createContext<CartContextType | undefined>(undefined);
// 🧠 Skapar själva contextet (en "global plats") som andra komponenter kan använda
// 🎒 Tänk som en gemensam ryggsäck man kan lägga saker i och hämta från

// -----------------------------------------------------------------------------
// CartProvider
// Wraps the app and provides the cart functionality to all components
// -----------------------------------------------------------------------------

export const CartProvider = ({ children }: { children: ReactNode }) => {
// 🛍️ CartProvider är en komponent som "wrappar" hela appen och ger den tillgång till varukorgen

  const [cart, setCart] = useState<CartItem[]>([]);
  // 🎯 useState skapar ett state (lagringsplats) för alla produkter i varukorgen

  // 🛒 Lägg till produkt eller öka antal om den redan finns
  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // 🔁 Produkten finns redan → öka bara antalet
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      // ➕ Produkten fanns inte → lägg till ny
      return [...prevCart, product];
    });
  };

  // 🔢 Ändrar hur många av en viss produkt
  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
    // ✏️ Vi ser till att det aldrig kan vara mindre än 1 (Math.max)
  };

  // ❌ Tar bort en produkt från varukorgen
  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // 🧹 Tömmer hela varukorgen
  const clearCart = () => {
    setCart([]);
  };

  // 💰 Räknar ut totalsumman för hela varukorgen
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    // 🧮 .reduce går igenom alla produkter och räknar ut totalen
  };

  // 📦 Returnerar själva "context-paketet" så alla komponenter kan använda det
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
  // 🔌 Kopplar in komponenten till CartContext (eluttag till systemet)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
    // 🚨 Felmeddelande om någon försöker använda context utanför Provider
  }
  return context;
  // 🧠 Returnerar alla funktioner & värden från CartContext
};
