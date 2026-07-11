import { useState } from "react";
import { NavLink } from "react-router-dom";
import { productList } from "../../config/products";
import "./Nav.css";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="nav-header">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          Maxie Apps
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={menuOpen ? "nav-links nav-links-open" : "nav-links"}>
          <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)} end>
            Home
          </NavLink>
          <NavLink to="/downloads" className={navLinkClass} onClick={() => setMenuOpen(false)} end>
            Downloads
          </NavLink>
          {productList.map((product) => (
            <NavLink
              key={product.slug}
              to={`/downloads/${product.slug}`}
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {product.name}
            </NavLink>
          ))}
          <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
