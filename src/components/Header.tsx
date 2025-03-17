// src/components/Header.tsx
import { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

// Font Awesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

// Import your cart context hook
import { useCart } from "../pages/Cart/CartContext";

type HeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  // Destructure "cart" from your context
  const { cart } = useCart();

  // Calculate total quantity from each item's quantity in the cart.
  const totalItems = cart.reduce((sum: number, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <nav className="nav-bar">
        <ul>
          <li><Link to="/">Nyheter</Link></li>
          <li><Link to="/topplistan">Topplistan</Link></li>
          <li><Link to="/rea">Rea</Link></li>
          <li><Link to="/kampanjer">Kampanjer</Link></li>
        </ul>
      </nav>

      <div className="header-actions">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchInput}
          />
          <button>Search</button>
        </div>

        <div className="cart-link">
          <Link to="/cart" aria-label="Cart">
            <FontAwesomeIcon icon={faShoppingCart} size="2x" />
            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
