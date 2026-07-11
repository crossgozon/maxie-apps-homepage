import { Link } from "react-router-dom";
import { productList } from "../../config/products";
import { ThemeScope } from "../../theme/ThemeProvider";
import { ReleasePanel } from "../../components/ReleasePanel/ReleasePanel";
import "./Downloads.css";

export function Downloads() {
  return (
    <main className="downloads-page">
      <div className="downloads-header">
        <h1>Downloads</h1>
        <p>Official builds for MaxClicker and MaxMacro, pulled directly from GitHub Releases.</p>
      </div>

      <div className="downloads-grid">
        {productList.map((product) => (
          <ThemeScope key={product.slug} theme={product.theme} className="downloads-product">
            <div className="downloads-product-header">
              <h2>{product.name}</h2>
              <Link to={`/downloads/${product.slug}`} className="downloads-product-link">
                Full details →
              </Link>
            </div>
            <ReleasePanel product={product} />
          </ThemeScope>
        ))}
      </div>
    </main>
  );
}
