import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/Layout";
import { LayoutWrapper } from "./components/LayoutWrapper";
import { Loader } from "./components/Loader";
import { ParticleBackground } from "./components/ParticleBackground";
import { MobileParticles } from "./components/MobileParticles";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { Games } from "./pages/Games";
import { Characters } from "./pages/Characters";
import { GameDetail } from "./pages/GameDetail";
import { CharacterDetail } from "./pages/CharacterDetail";
import { NotFound } from "./pages/NotFound";

function App() {
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const visited = sessionStorage.getItem('visited');
    if (visited) {
      setLoading(false);
    } else {
      sessionStorage.setItem('visited', 'true');
      setTimeout(() => setLoading(false), 800);
    }
  }, []);

  return (
    <LayoutWrapper>
      {isMobile ? <MobileParticles /> : <ParticleBackground />}
      <AnimatePresence>
        {loading && <Loader key="loader" />}
      </AnimatePresence>
      {!loading && (
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="games" element={<Games />} />
              <Route path="personajes" element={<Characters />} />
              <Route path="juego/:slug" element={<GameDetail />} />
              <Route path="juego/:gameSlug/:charSlug" element={<CharacterDetail />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      )}
    </LayoutWrapper>
  );
}

export default App;
