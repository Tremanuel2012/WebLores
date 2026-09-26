import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/Layout";
import { LayoutWrapper } from "./components/LayoutWrapper";
import { Loader } from "./components/Loader";
import { ParticleBackground } from "./components/ParticleBackground";
import { Home } from "./pages/Home";
import { Games } from "./pages/Games";
import { GameDetail } from "./pages/GameDetail";
import { CharacterDetail } from "./pages/CharacterDetail";
import { NotFound } from "./pages/NotFound";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <LayoutWrapper>
      <ParticleBackground />
      <AnimatePresence>
        {loading && <Loader key="loader" />}
      </AnimatePresence>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="games" element={<Games />} />
            <Route path="juego/:slug" element={<GameDetail />} />
            <Route path="juego/:gameSlug/:charSlug" element={<CharacterDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LayoutWrapper>
  );
}

export default App;
