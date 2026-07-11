import { useParams } from "react-router-dom";
import { products, type ProductSlug } from "../../config/products";
import { ThemeScope } from "../../theme/ThemeProvider";
import { ReleasePanel } from "../../components/ReleasePanel/ReleasePanel";
import { NotFound } from "../NotFound/NotFound";
import "./ProductDownloadPage.css";

export function ProductDownloadPage() {
  const { productSlug } = useParams<{ productSlug: ProductSlug }>();
  const product = productSlug ? products[productSlug] : undefined;

  if (!product) {
    return <NotFound />;
  }

  return (
    <ThemeScope theme={product.theme} as="main" className="product-download-page">
      <div className="product-download-hero">
        <img src={product.iconUrl} alt="" width={64} height={64} className="product-download-icon" />
        <span className="product-download-eyebrow">{product.tagline}</span>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
      </div>

      <div className="product-download-panel">
        <ReleasePanel product={product} showNotes />
      </div>
    </ThemeScope>
  );
}
