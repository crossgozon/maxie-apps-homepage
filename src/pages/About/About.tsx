import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faShieldHalved,
  faScaleBalanced,
  faBoxesStacked,
} from "@fortawesome/free-solid-svg-icons";
import { productList } from "../../config/products";
import { ThemeScope } from "../../theme/ThemeProvider";
import { DocModal, type DocModalTarget } from "../../components/DocModal/DocModal";
import "./About.css";

const legalIcons: Record<string, typeof faFileContract> = {
  EULA: faFileContract,
  "Privacy Policy": faShieldHalved,
  "Terms of Use": faScaleBalanced,
  "Third-Party Notices": faBoxesStacked,
};

export function About() {
  const [openDoc, setOpenDoc] = useState<DocModalTarget | null>(null);

  return (
    <main className="about-page">
      <div className="about-page-bg" aria-hidden="true" />

      <section className="about-intro gv-fade-up">
        <img src="/assets/maxie-badge.png" alt="" className="about-badge" aria-hidden="true" />
        <h1>Tools built for precision.</h1>
        <p>
          Maxie Apps is where I build MaxClicker and MaxMacro. MaxClicker handles auto-potion and macro
          automation for MU Online and other MMORPGs, while MaxMacro is a macro-building workspace for
          binding precise, repeatable keyboard and mouse sequences. This site is the official source for
          both — real downloads, real updates, nothing else.
        </p>
      </section>

      <section className="about-products">
        {productList.map((product) => (
          <ThemeScope key={product.slug} theme={product.theme} className="about-product gv-fade-up">
            <div
              className="about-product-bg"
              style={{ backgroundImage: `url(/assets/${product.slug}/background.jpg)` }}
              aria-hidden="true"
            />
            <img src={product.iconUrl} alt="" width={52} height={52} className="about-product-icon" />
            <div className="about-product-body">
              <h2>{product.name}</h2>
              <p>{product.description}</p>

              <div className="about-product-links">
                <Link to={`/${product.slug}`} className="about-product-cta">
                  Get {product.name} →
                </Link>

                {product.legalDocs && (
                  <div className="about-legal-links">
                    {product.legalDocs.map((doc) => (
                      <button
                        key={doc.url}
                        type="button"
                        className="about-legal-link"
                        onClick={() => setOpenDoc({ ...doc, appName: product.name })}
                      >
                        <FontAwesomeIcon icon={legalIcons[doc.label] ?? faFileContract} />
                        {doc.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ThemeScope>
        ))}
      </section>

      <section className="about-note gv-fade-up">
        <h2>Official downloads</h2>
        <p>
          MaxClicker and MaxMacro are distributed only through this website and their GitHub release pages,
          with our own Backblaze mirror as a backup host — no third-party downloads, no bundled installers.
          Updates are published the same way, so the <Link to="/downloads">Downloads</Link> page always has
          the current version of both.
        </p>
      </section>

      <section className="about-note gv-fade-up">
        <h2>MAXPERFORMANCE</h2>
        <p>
          We also build <Link to="/maxperformance">MAXPERFORMANCE</Link>, a macro benchmarking tool that
          captures real keyboard and mouse input timing, scores stability and warm-up accuracy, and
          compares runs side by side — so you can see exactly how a macro setup performs, instead of
          guessing.
        </p>
      </section>

      <DocModal doc={openDoc} onClose={() => setOpenDoc(null)} />
    </main>
  );
}
