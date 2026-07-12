import { useEffect } from "react";
import { ThemeScope } from "../../theme/ThemeProvider";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { PageTransition } from "../PageTransition/PageTransition";
import { preloadPageBackgrounds } from "../../utils/preloadBackgrounds";

export function Layout() {
  useEffect(() => {
    preloadPageBackgrounds();
  }, []);

  return (
    <ThemeScope theme="neutral" as="div" className="app-shell">
      <Nav />
      <PageTransition />
      <Footer />
    </ThemeScope>
  );
}
