// Header.tsx
import { ChangeEvent } from "react";
import "./Header.css";

type HeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

function Header({ searchTerm, onSearchChange }: HeaderProps) {
  const handleSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <header className="header">
      <nav className="nav-bar">
        <ul>
          <li>Nyheter</li>
          <li>Topplistan</li>
          <li>Rea</li>
          <li>Kampanjer</li>
        </ul>
      </nav>

      <div className="search-bar">
        {/* Use searchTerm as the input value, and update it on change */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchInput}
        />
        <button>Search</button>
      </div>
    </header>
  );
}

export default Header;
