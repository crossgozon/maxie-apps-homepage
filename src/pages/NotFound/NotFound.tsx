import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main style={{ padding: "40px 24px", maxWidth: 1180, margin: "0 auto" }}>
      <h1>Page not found</h1>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </main>
  );
}
