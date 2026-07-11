import { ThemeScope } from "../../theme/ThemeProvider";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageTransition } from "../PageTransition/PageTransition";

export function Layout() {
  return (
    <ThemeScope theme="neutral" as="div" className="app-shell">
      <Nav />
      <PageTransition />
      <Footer />
    </ThemeScope>
  );
}
