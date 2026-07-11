import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { productList } from "../../config/products";
import { ThemeScope } from "../../theme/ThemeProvider";
import "./Home.css";

export function Home() {
  return (
    <main className="home-page">
      <div className="home-hero-orb home-hero-orb-blue" aria-hidden="true" />
      <div className="home-hero-orb home-hero-orb-red" aria-hidden="true" />
      <div className="home-hero-orb home-hero-orb-amber" aria-hidden="true" />

      <section className="home-split">
        {productList.map((product) => (
          <ThemeScope
            key={product.slug}
            theme={product.theme}
            as={Link}
            to={`/${product.slug}`}
            className="home-split-side"
          >
            <div className="home-split-glow" aria-hidden="true" />
            <img src={product.iconUrl} alt="" className="home-split-watermark" aria-hidden="true" />
            {product.wordmarkUrl ? (
              <div className="home-split-wordmark-frame">
                <img src={product.wordmarkUrl} alt={product.name} className="home-split-wordmark" />
              </div>
            ) : (
              <h2 className="home-split-name">{product.name}</h2>
            )}
            <p className="home-split-tagline">{product.heroHook}</p>
            <span className="home-split-cta">
              Explore {product.name}
              <FontAwesomeIcon icon={faArrowRight} className="home-split-cta-icon" />
            </span>
          </ThemeScope>
        ))}

        <div className="home-center">
          <div className="home-badge-frame gv-fade-up">
            <div className="home-badge-glow" aria-hidden="true" />
            <img src="/assets/maxie-badge.png" alt="Maxie Apps" className="home-center-badge" />
          </div>
          <span className="home-center-status gv-fade-up">
            <span className="home-hero-status-dot" />
            One arsenal · two weapons
          </span>
          <h1 className="home-center-title gv-fade-up" style={{ animationDelay: "0.08s" }}>
            Precision, automated.
          </h1>
          <p className="home-center-subtitle gv-fade-up" style={{ animationDelay: "0.16s" }}>
            MaxClicker and MaxMacro: built for speed, built for reliability, built to repeat every move
            exactly. Pick your side.
          </p>
        </div>
      </section>
    </main>
  );
}
