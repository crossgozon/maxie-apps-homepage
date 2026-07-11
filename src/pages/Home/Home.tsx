import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { productList } from "../../config/products";
import { ThemeScope } from "../../theme/ThemeProvider";
import "./Home.css";

// The hero images (badge, icons, wordmarks) are large enough that the
// door-close/fade-up animations could finish playing before they've even
// downloaded, showing an empty/incomplete-looking reveal. Preloading them
// and holding off on mounting the animated content until they're actually
// ready means "mount = animate" stays true - the reveal only plays once
// there's something real to reveal.
function getHeroImageUrls(): string[] {
  const urls = ["/assets/maxie-badge.png"];
  for (const product of productList) {
    urls.push(product.iconUrl);
    if (product.wordmarkUrl) urls.push(product.wordmarkUrl);
  }
  return urls;
}

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // a broken/slow asset shouldn't block the reveal forever
    img.src = src;
  });
}

export function Home() {
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(getHeroImageUrls().map(preloadImage)).then(() => {
      if (!cancelled) setAssetsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!assetsReady) {
    return <main className="home-page home-page-loading" aria-busy="true" />;
  }

  return (
    <main className="home-page">
      <div className="home-hero-orb home-hero-orb-blue" aria-hidden="true" />
      <div className="home-hero-orb home-hero-orb-red" aria-hidden="true" />
      <div className="home-hero-orb home-hero-orb-amber" aria-hidden="true" />

      <section className="home-split">
        {productList.map((product, index) => (
          <ThemeScope
            key={product.slug}
            theme={product.theme}
            as={Link}
            to={`/${product.slug}`}
            className={`home-split-side ${index === 0 ? "home-door-left" : "home-door-right"}`}
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
          <div className="home-badge-frame gv-fade-up" style={{ animationDelay: "0.5s" }}>
            <div className="home-badge-glow" aria-hidden="true" />
            <img src="/assets/maxie-badge.png" alt="Maxie Apps" className="home-center-badge" />
          </div>
          <span className="home-center-status gv-fade-up" style={{ animationDelay: "0.58s" }}>
            <span className="home-hero-status-dot" />
            One arsenal · two weapons
          </span>
          <h1 className="home-center-title gv-fade-up" style={{ animationDelay: "0.66s" }}>
            Precision, automated.
          </h1>
          <p className="home-center-subtitle gv-fade-up" style={{ animationDelay: "0.74s" }}>
            MaxClicker and MaxMacro: built for speed, built for reliability, built to repeat every move
            exactly. Pick your side.
          </p>
        </div>
      </section>
    </main>
  );
}
