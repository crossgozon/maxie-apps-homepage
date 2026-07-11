import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons";
import { products, type ProductSlug } from "../../config/products";
import { ThemeScope } from "../../theme/ThemeProvider";
import { ReleasePanel } from "../../components/ReleasePanel/ReleasePanel";
import { Lightbox, type LightboxImage } from "../../components/Lightbox/Lightbox";
import { NotFound } from "../NotFound/NotFound";
import "./ProductDownloadPage.css";

export function ProductDownloadPage() {
  const { productSlug } = useParams<{ productSlug: ProductSlug }>();
  const product = productSlug ? products[productSlug] : undefined;
  const [lightboxImage, setLightboxImage] = useState<LightboxImage | null>(null);

  if (!product) {
    return <NotFound />;
  }

  const slideFrom = product.slug === "maxclicker" ? 96 : -96;
  const contentVariants: Variants = {
    enter: { opacity: 0, x: slideFrom },
    center: { opacity: 1, x: 0 },
  };

  return (
    <ThemeScope theme={product.theme} as="main" className="product-download-page">
      <div
        className="product-download-bg"
        style={{ backgroundImage: `url(/assets/${product.slug}/background.jpg)` }}
        aria-hidden="true"
      />
      <motion.div
        key={product.slug}
        className="product-download-content"
        variants={contentVariants}
        initial="enter"
        animate="center"
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="product-download-hero">
          {!product.wordmarkUrl && (
            <>
              <img src={product.iconUrl} alt="" width={64} height={64} className="product-download-icon" />
              <span className="product-download-eyebrow">{product.tagline}</span>
            </>
          )}
          {product.wordmarkUrl ? (
            <img src={product.wordmarkUrl} alt={product.name} className="product-download-wordmark" />
          ) : (
            <h1>{product.name}</h1>
          )}
          <p>{product.description}</p>
        </div>

        <div className="product-download-panel">
          <ReleasePanel product={product} showNotes />
        </div>

        {product.features.length > 0 && (
          <section className="product-features">
            <h2 className="product-section-title">Features</h2>
            <div className="feature-trunk">
              {product.features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`feature-branch ${index % 2 === 0 ? "feature-branch-left" : "feature-branch-right"}`}
                >
                  <span className="feature-node" aria-hidden="true" />
                  <span className="feature-stem" aria-hidden="true" />
                  <div className="product-feature-card gv-shell">
                    <div className="product-feature-icon">
                      <FontAwesomeIcon icon={feature.icon} />
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    {feature.images && (
                      <div className="product-feature-images">
                        {feature.images.map((image) => (
                          <button
                            key={image.src}
                            type="button"
                            className="product-feature-image"
                            onClick={() => setLightboxImage(image)}
                          >
                            <img src={image.src} alt={image.caption} loading="lazy" />
                            <span className="product-feature-image-zoom" aria-hidden="true">
                              <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
                            </span>
                            <span className="product-feature-image-caption">{image.caption}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {product.systemRequirements && (
          <section className="product-requirements">
            <h2 className="product-section-title">System Requirements</h2>
            <div className="product-requirements-card gv-shell">
              {product.systemRequirements.map((requirement) => (
                <div key={requirement.label} className="product-requirements-row">
                  <span>{requirement.label}</span>
                  <strong>{requirement.value}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </motion.div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </ThemeScope>
  );
}
