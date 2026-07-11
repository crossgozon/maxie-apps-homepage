import { useParams } from "react-router-dom";
import { products, type ProductSlug } from "../../config/products";
import { NotFound } from "../NotFound/NotFound";

export function ProductDownloadPage() {
  const { productSlug } = useParams<{ productSlug: ProductSlug }>();
  const product = productSlug ? products[productSlug] : undefined;

  if (!product) {
    return <NotFound />;
  }

  return (
    <main style={{ padding: "40px 24px", maxWidth: 1180, margin: "0 auto" }}>
      <h1>{product.name} download</h1>
      <p>Full release panel coming in Phase 6.</p>
    </main>
  );
}
