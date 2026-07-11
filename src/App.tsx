import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Home } from "./pages/Home/Home";
import { Downloads } from "./pages/Downloads/Downloads";
import { ProductDownloadPage } from "./pages/Downloads/ProductDownloadPage";
import { About } from "./pages/About/About";
import { NotFound } from "./pages/NotFound/NotFound";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="downloads/:productSlug" element={<ProductDownloadPage />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
