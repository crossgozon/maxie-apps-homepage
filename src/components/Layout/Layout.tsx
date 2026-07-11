import { Outlet } from "react-router-dom";
import { ThemeScope } from "../../theme/ThemeProvider";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <ThemeScope theme="neutral" as="div" className="app-shell">
      <Nav />
      <Outlet />
      <Footer />
    </ThemeScope>
  );
}
