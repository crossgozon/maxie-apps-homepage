import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCircleInfo, faGamepad, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { productList } from "../../config/products";
import "./Nav.css";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link-active" : "nav-link";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = useLocation().pathname === "/";

  return (
    <header className="nav-header">
      <div className="nav-inner">
        {/* Skipped on the Home page - the big "Maxie Apps" badge already
            sits front and center there, so a second copy of the same
            logo in the header just above it read as redundant. */}
        {!isHome && (
          <NavLink to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
            <img src="/assets/maxie-apps_title_header.png" alt="Maxie Apps" className="nav-brand-logo" />
          </NavLink>
        )}

        <button
          type="button"
          className={menuOpen ? "nav-toggle nav-toggle-open" : "nav-toggle"}
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
            <FontAwesomeIcon icon={faHouse} />
            Home
          </NavLink>
          {/* MaxPerformance is deliberately excluded here - it has its own
              dedicated link below (chart icon fits it better than the
              gamepad icon used for the automation apps), so including it
              in this product-registry map would render it twice. */}
          {productList
            .filter((product) => product.slug !== "maxperformance")
            .map((product) => (
              <NavLink
                key={product.slug}
                to={`/${product.slug}`}
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faGamepad} />
                {product.name}
              </NavLink>
            ))}
          <NavLink to="/maxperformance" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faChartLine} />
            MaxPerformance
          </NavLink>
          <NavLink to="/about" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            <FontAwesomeIcon icon={faCircleInfo} />
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
