import { ThemeScope } from "./theme/ThemeProvider";
import { productList } from "./config/products";

/**
 * Phase 1 verification view: confirms the Rajdhani font and both product
 * palettes load correctly. Replaced by real routing in Phase 2.
 */
function App() {
  return (
    <ThemeScope theme="neutral" as="main" className="phase1-shell">
      <h1>Maxie Apps — Phase 1 theme check</h1>
      <p>Routing, layout, and real pages arrive in later phases.</p>
      <div className="phase1-cards">
        {productList.map((product) => (
          <ThemeScope key={product.slug} theme={product.theme} className="phase1-card">
            <h2>{product.name}</h2>
            <p>{product.tagline}</p>
            <p>{product.description}</p>
          </ThemeScope>
        ))}
      </div>
    </ThemeScope>
  );
}

export default App;
