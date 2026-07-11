import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Home } from "./pages/Home/Home";
import { Downloads } from "./pages/Downloads/Downloads";
import { ProductDownloadPage } from "./pages/Downloads/ProductDownloadPage";
import { About } from "./pages/About/About";
import { Benchmark } from "./pages/Benchmark/Benchmark";
import { NotFound } from "./pages/NotFound/NotFound";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="downloads" element={<Downloads />} />
          {/* Short top-level paths (/maxclicker, /maxmacro) are the ones
              actually linked to from the rest of the site now - the nested
              /downloads/:productSlug form still works too since static
              segments (about, maxperformance, downloads) always outrank a
              dynamic :productSlug param regardless of route order. */}
          <Route path="downloads/:productSlug" element={<ProductDownloadPage />} />
          <Route path=":productSlug" element={<ProductDownloadPage />} />
          <Route path="maxperformance" element={<Benchmark />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
