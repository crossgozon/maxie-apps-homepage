import { Link } from "react-router-dom";
import { ThemeScope } from "../../theme/ThemeProvider";
import type { ProductConfig } from "../../config/products";
import "../common/Button.css";
import "./ProductCard.css";

interface ProductCardProps {
  product: ProductConfig;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <ThemeScope theme={product.theme} className="product-card">
      <img src={product.iconUrl} alt="" className="product-card-icon" width={48} height={48} />
      <h3 className="product-card-name">{product.name}</h3>
      <p className="product-card-tagline">{product.tagline}</p>
      <p className="product-card-description">{product.description}</p>
      <div className="product-card-actions">
        <Link to={`/downloads/${product.slug}`} className="btn btn-primary">
          Download
        </Link>
        <Link to={`/downloads/${product.slug}`} className="btn btn-secondary">
          View Product
        </Link>
      </div>
    </ThemeScope>
  );
}
