import { productList } from "../../config/products";
import { ProductCard } from "../../components/ProductCard/ProductCard";
import "./Home.css";

export function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-inner">
          <span className="home-hero-eyebrow">Maxie Apps</span>
          <h1 className="home-hero-title">Tools built for precision.</h1>
          <p className="home-hero-subtitle">
            MaxClicker and MaxMacro are Windows desktop utilities for fast, reliable, and repeatable input
            automation. Pick a product below to learn more or grab the latest build.
          </p>
        </div>
      </section>

      <section className="home-products">
        <div className="home-products-inner">
          {productList.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
