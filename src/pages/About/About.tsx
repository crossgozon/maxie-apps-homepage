import { Link } from "react-router-dom";
import { productList } from "../../config/products";
import "./About.css";

export function About() {
  return (
    <main className="about-page">
      <section className="about-intro">
        <h1>About Maxie Apps</h1>
        <p>
          Maxie Apps is the publisher behind MaxClicker and MaxMacro, two focused Windows desktop utilities
          for automated and repeatable input. This site is the official place to learn about each product
          and get official downloads and updates.
        </p>
      </section>

      <section className="about-products">
        {productList.map((product) => (
          <div key={product.slug} className="about-product">
            <img src={product.iconUrl} alt="" width={40} height={40} />
            <div>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <Link to={`/downloads/${product.slug}`}>Get {product.name} →</Link>
            </div>
          </div>
        ))}
      </section>

      <section className="about-note">
        <h2>Official downloads</h2>
        <p>
          Both applications are distributed exclusively through this website and their GitHub release
          pages. Updates are published the same way — check the{" "}
          <Link to="/downloads">Downloads</Link> page for the latest version of either product.
        </p>
      </section>
    </main>
  );
}
