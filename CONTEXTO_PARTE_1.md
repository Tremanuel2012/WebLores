# CONTEXTO COMPLETO — WebLores (Parte 1 de 3)

## BLOQUE 0 — Instrucciones de uso
Este archivo es la parte 1/3 del contexto completo del proyecto WebLores. Se debe pegar al inicio de un chat nuevo junto con las partes 2 y 3 para dar contexto técnico completo al asistente.

## BLOQUE 1 — Documentación consolidada

### Resumen del Proyecto
WebLores es una web de lore de personajes de videojuegos. 
- URL producción: https://tremanuel2012.github.io/WebLores/
- Repo: https://github.com/Tremanuel2012/WebLores
- Autor: Tremanuel2012

### Stack Técnico
- React 19.2.8, React DOM 19.2.8
- Vite 8.3.0
- TypeScript 6.0.2
- Tailwind CSS 4.3.3
- Framer Motion 13.4.4
- React Router DOM 7.18.4
- react-markdown 10.1.0, remark-gfm 4.0.1
- js-yaml 4.1.0, @types/js-yaml 4.0.9
- lucide-react 1.48.0
- Lenis 1.3.26
- oxlint 1.81.0

### Estructura de carpetas
- `src/`: código fuente (React).
- `content/`: Markdown (.md) de juegos y personajes.
- `public/`: Assets, CMS config.
- `scripts/`: automatización.
- `.github/workflows/`: deploy.

### Arquitectura de contenido
- Juegos: `content/games/<slug>.md`
- Personajes: `content/characters/<slug-juego>/<slug-personaje>.md`
- Lector: `src/lib/content.ts` (import.meta.glob + js-yaml).

### Estilos (Tailwind v4)
- @import "tailwindcss"; + @plugin "@tailwindcss/typography";
- No existe tailwind.config.js.

### Sistema de imágenes
- `public/images/uploads`: carpeta del CMS.
- `withBase()` añade `/WebLores/`. NUNCA poner `/WebLores/` en los .md.

### Sistema de rutas (HashRouter)
| Ruta | Página |
|------|--------|
| / | Home |
| /games | Games |
| /personajes | Characters |
| /juego/:slug | GameDetail |
| /juego/:gameSlug/:charSlug | CharacterDetail |
| * | NotFound |

### Decisiones técnicas clave
- HashRouter (GitHub Pages).
- AnimatePresence dentro de Layout.
- Partículas: canvas (desktop) vs DOM (móvil).

### Flujo del autor
1. CMS (Publish).
2. `npm run organize` (mover imágenes).
3. `npm run sync` (crear carpetas si juego nuevo).
4. GitHub Actions (deploy).

## BLOQUE 2 — Archivos clave en crudo (Parte 1/2)

### **package.json**
```json
{
  "name": "weblores",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "cms": "npx decap-server",
    "sync": "node scripts/sync-folders.mjs",
    "organize": "node scripts/organize-images.mjs"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "framer-motion": "^13.4.4",
    "gray-matter": "^4.0.3",
    "lenis": "^1.3.26",
    "lucide-react": "^1.48.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.18.4",
    "remark-gfm": "^4.0.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.20",
    "@types/js-yaml": "^4.0.9",
    "@types/node": "^24.13.3",
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "oxlint": "^1.81.0",
    "tailwindcss": "^4.3.3",
    "typescript": "~6.0.2",
    "vite": "^8.3.0",
    "vite-plugin-markdown": "^2.2.0"
  }
}
```

### **vite.config.ts**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/WebLores/',
})
```

### **src/index.css**
```css
@import "tailwindcss";

@plugin "@tailwindcss/typography";

@theme {
  --color-dark: #0a0a0f;
  --color-accent-primary: #8b5cf6;
  --color-accent-secondary: #06b6d4;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-dark text-gray-100 antialiased;
    margin: 0;
    min-height: 100vh;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #0a0a0f;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #8b5cf6, #06b6d4);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #06b6d4, #8b5cf6);
  }

  ::selection {
    background: rgba(139, 92, 246, 0.35);
    color: #fff;
  }
}

@keyframes particle-pulse {
  0%, 100% { opacity: 0.15; }
  50%      { opacity: 0.7; }
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: #ffffff;
  border-radius: 50%;
  will-change: opacity;
  animation: particle-pulse var(--duration, 4s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
}
```

### **src/App.tsx**
```tsx
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
```

### **src/main.tsx**
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### **src/types/content.ts**
```typescript
export interface Game {
  title: string;
  slug: string;
  cover: string;
  description: string;
  year: number;
  developer: string;
  genre: string;
  themeColor: string;
  content: string; // Cuerpo Markdown del juego
}

export interface Character {
  name: string;
  slug: string;
  game: string;
  role: string;
  faction: string;
  quote: string;
  cover: string;
  gallery: string[];
  tags: string[];
  order: number;
  themeColor: string;
  content: string; // Cuerpo Markdown del personaje
}
```
