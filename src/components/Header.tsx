import React from "react";
import "./Header.css";

function Header() {
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
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    </header>
  );
}

export default Header;
