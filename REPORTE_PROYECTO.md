# Reporte de Proyecto: WebLores

## 1. ESTRUCTURA DEL PROYECTO

```
src/
  assets/
  components/
    CustomCursor.tsx
    GlitchText.tsx
    GlobalBackground.tsx
    Image.tsx
    Layout.tsx
    LayoutWrapper.tsx
    Loader.tsx
    LoreRenderer.tsx
    ParticleBackground.tsx
  hooks/
  lib/
    content.ts
  pages/
    CharacterDetail.tsx
    GameDetail.tsx
    Games.tsx
    Home.tsx
    NotFound.tsx
  types/
    content.ts
  App.css
  App.tsx
  index.css
  main.tsx
content/
  hollow-knight/
    _game.md
    hornet.md
    the-knight.md
public/
  admin/
    config.yml
    index.html
  images/
  favicon.svg
  icons.svg
```

## 2. CONTENIDO DE ARCHIVOS

### package.json
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
    "preview": "vite preview"
  },
  "dependencies": {
    "@studio-freight/react-lenis": "^0.0.47",
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

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
   base: '/WebLores/',
})
```

### tsconfig.json
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### src/main.tsx
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

### src/App.tsx
```tsx
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
```

### src/index.css
```css
@import "tailwindcss";

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
```

### src/types/content.ts
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

### src/lib/content.ts
```typescript
import * as yaml from 'js-yaml';

import type { Game, Character } from '../types/content';

// Importa todos los archivos markdown de content
const gameFiles = import.meta.glob('/content/*/_game.md', { query: '?raw', import: 'default', eager: true });
const characterFiles = import.meta.glob('/content/*/*.md', { query: '?raw', import: 'default', eager: true });

const parseMarkdown = (rawContent: string) => {
  const match = rawContent.match(/^---[\s\S]*?---\n/);
  if (!match) return { data: {}, content: rawContent };
  
  const frontmatterRaw = match[0].replace(/---/g, '').trim();
  const content = rawContent.slice(match[0].length);
  
  const data = yaml.load(frontmatterRaw) as any;
  return { data, content };
};

export const getAllGames = (): Game[] => {
  return Object.entries(gameFiles).map(([_, content]) => {
    const { data, content: markdownContent } = parseMarkdown(content as string);
    return { ...data, content: markdownContent } as Game;
  });
};

export const getGameBySlug = (slug: string): Game | undefined => {
  return getAllGames().find(game => game.slug === slug);
};

export const getCharactersByGame = (gameSlug: string): Character[] => {
  return Object.entries(characterFiles)
    .filter(([path]) => path.includes(`/content/${gameSlug}/`) && !path.endsWith('_game.md'))
    .map(([_, content]) => {
      const { data, content: markdownContent } = parseMarkdown(content as string);
      return { ...data, content: markdownContent } as Character;
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const getCharacterBySlug = (gameSlug: string, charSlug: string): Character | undefined => {
  return getCharactersByGame(gameSlug).find(char => char.slug === charSlug);
};

export const getAllCharacters = (): Character[] => {
  return Object.entries(characterFiles)
    .filter(([path]) => !path.endsWith('_game.md'))
    .map(([_, content]) => {
      const { data, content: markdownContent } = parseMarkdown(content as string);
      return { ...data, content: markdownContent } as Character;
    });
};
```

### src/components/Layout.tsx
```tsx
import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const Layout = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => setShowTopBtn(window.scrollY > 400));
  }, []);

  return (
    <div className="min-h-screen bg-dark text-gray-100 overflow-x-hidden selection:bg-accent-primary/30">
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-primary origin-left z-50" style={{ scaleX }} />

      {/* Navbar */}
      <nav className="fixed w-full backdrop-blur-md bg-dark/50 z-40 border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">LoreHub</Link>
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            {['Inicio', 'Juegos', 'Personajes', 'Acerca'].map(item => (
              <Link key={item} to={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} className="hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 border-t border-white/5 text-sm">
        <p>© {new Date().getFullYear()} LoreHub - Creado con pasión</p>
      </footer>

      {/* Scroll to Top */}
      {showTopBtn && (
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-accent-primary/20 backdrop-blur rounded-full hover:bg-accent-primary transition-all z-40"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};
```

### src/components/LoreRenderer.tsx
```tsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LoreRendererProps {
  content: string;
}

export const LoreRenderer: React.FC<LoreRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-100 prose-p:text-gray-300 prose-a:text-accent-primary hover:prose-a:text-accent-secondary prose-strong:text-white transition-all">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
```

### src/components/Loader.tsx
```tsx
import { motion, AnimatePresence } from 'framer-motion';
 export const Loader = () => {
  return (
    <AnimatePresence>
    <motion.div 
      className="fixed inset-0 z-[1000] bg-dark flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-4xl font-bold text-accent-primary"
      >
        L
      </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};
```

### src/components/GlitchText.tsx
```tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const GlitchText = ({ text }: { text: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <motion.span
      className="inline-block cursor-default"
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
      animate={isGlitching ? {
        x: [0, -2, 2, -2, 0],
        skewX: [0, 10, -10, 0],
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {text}
    </motion.span>
  );
};
```

### src/components/ParticleBackground.tsx
```tsx
 import { useEffect, useRef } from 'react';

export const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
```

### src/components/CustomCursor.tsx
```tsx
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-accent-primary pointer-events-none z-[9999] hidden md:block"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
      }}
    />
  );
};
```

### src/components/Image.tsx
```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

export const Image = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-white/10 animate-pulse" />
      )}
      <motion.img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};
```

### src/components/GlobalBackground.tsx
```tsx
import { motion } from 'framer-motion';

export const GlobalBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-dark">
      {/* Grano de película */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Blobs */}
      <motion.div 
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-primary/20 blur-[120px]"
      />
      <motion.div 
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-secondary/20 blur-[120px]"
      />
      
      {/* Rejilla */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
    </div>
  );
};
```

### src/components/LayoutWrapper.tsx
```tsx
import { useEffect } from 'react';
import Lenis from 'lenis';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      lerp: 0.1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
```

### src/pages/Home.tsx
```tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllGames, getAllCharacters } from "../lib/content";

export const Home = () => {
  const games = getAllGames();
  const characters = getAllCharacters();

  return (
    <div className="flex flex-col gap-20 pb-20">
      <section className="h-screen flex items-center justify-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Explora el Lore
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Sumérgete en las historias, personajes y secretos de tus mundos favoritos.
          </p>
          <Link
            to="/games"
            className="inline-block px-8 py-3 bg-accent-primary hover:bg-accent-secondary transition-colors rounded-full font-semibold"
          >
            Explorar juegos
          </Link>
        </motion.div>
      </section>

      <section className="px-6 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-10">Juegos destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {games.map((game) => (
            <motion.div
              key={game.slug}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 p-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={game.cover}
                alt={game.title}
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold">{game.title}</h3>
                <p className="text-gray-400 text-sm">{game.genre}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden py-10 bg-white/5">
        <h2 className="text-3xl font-bold mb-10 px-6 max-w-7xl mx-auto">
          Personajes
        </h2>
        <motion.div
          className="flex gap-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...characters, ...characters].map((char, i) => (
            <div
              key={i}
              className="min-w-[200px] p-4 border border-white/10 rounded-xl bg-dark"
            >
              <p className="font-bold">{char.name}</p>
              <p className="text-xs text-accent-primary">{char.game}</p>
            </div>
          ))}
        </motion.div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto w-full">
        {[
          { label: "Juegos", value: games.length },
          { label: "Personajes", value: characters.length },
          { label: "Reinos", value: "???" },
          { label: "Secretos", value: "∞" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            className="p-6 border border-white/10 rounded-2xl bg-white/5 text-center"
          >
            <div className="text-3xl font-bold text-accent-primary">
              {stat.value}
            </div>
            <div className="text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
```

### src/pages/Games.tsx
```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllGames } from '../lib/content';

export const Games = () => {
  const games = getAllGames();
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const genres = ['Todos', ...Array.from(new Set(games.map(g => g.genre)))];
  
  const filteredGames = games.filter(g => 
    (filter === 'Todos' || g.genre === filter) &&
    g.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Catálogo de Juegos</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <input 
          type="text" placeholder="Buscar juego..." 
          className="bg-white/5 border border-white/10 p-3 rounded-xl flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="bg-white/5 border border-white/10 p-3 rounded-xl" onChange={(e) => setFilter(e.target.value)}>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredGames.map(game => (
            <motion.div key={game.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border border-white/10 rounded-2xl p-4 bg-white/5">
              <img src={game.cover} alt={game.title} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h2 className="text-xl font-bold">{game.title}</h2>
              <p className="text-sm text-gray-400 mb-4">{game.genre}</p>
              <Link to={`/juego/${game.slug}`} className="block text-center py-2 bg-accent-primary rounded-lg text-sm font-semibold">Ver Lore</Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
```

### src/pages/GameDetail.tsx
```tsx
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getGameBySlug, getCharactersByGame } from '../lib/content';
import { LoreRenderer } from '../components/LoreRenderer';

export const GameDetail = () => {
  const { slug } = useParams();
  const game = getGameBySlug(slug || '');
  const characters = getCharactersByGame(slug || '');

  if (!game) return <div className="p-20 text-center">Juego no encontrado</div>;

  return (
    <div className="min-h-screen" style={{ '--accent-color': game.themeColor } as React.CSSProperties}>
      {/* Hero */}
      <section className="relative h-[60vh] flex items-end p-12 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${game.cover})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-6xl font-bold mb-4">{game.title}</h1>
          <p className="text-lg opacity-80">{game.developer} • {game.year} • {game.genre}</p>
        </motion.div>
      </section>

      {/* Info & Characters */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-xl mb-12 text-gray-300">{game.description}</p>
        
        <h2 className="text-3xl font-bold mb-8">Personajes Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {characters.map((char) => (
            <motion.div key={char.slug} whileHover={{ y: -10 }} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <img src={char.cover} className="w-full h-48 object-cover rounded-xl mb-4" alt={char.name} />
              <h3 className="text-2xl font-bold mb-2">{char.name}</h3>
              <p className="text-sm text-[var(--accent-color)] mb-4">{char.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Lore Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-8">Historia y Lore</h2>
          <LoreRenderer content={game.content} />
        </div>
      </div>
    </div>
  );
};
```

### src/pages/CharacterDetail.tsx
```tsx
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { getCharacterBySlug, getCharactersByGame } from '../lib/content';
import { LoreRenderer } from '../components/LoreRenderer';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export const CharacterDetail = () => {
  const { gameSlug, charSlug } = useParams();
  const character = getCharacterBySlug(gameSlug || '', charSlug || '');
  const allChars = getCharactersByGame(gameSlug || '');
  const currentIndex = allChars.findIndex(c => c.slug === charSlug);
  
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (!character) return <div className="p-20 text-center">Personaje no encontrado</div>;

  return (
    <div className="relative min-h-screen">
      <motion.div className="fixed left-0 top-0 w-1 bg-accent-primary origin-top z-[60]" style={{ scaleY }} />
      
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Izquierda: Sticky Sidebar */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to={`/juego/${gameSlug}`} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver al juego
            </Link>
            <img src={character.cover} alt={character.name} className="w-full h-96 object-cover rounded-3xl mb-6 shadow-2xl" />
            <h1 className="text-5xl font-bold mb-4">{character.name}</h1>
            <div className="space-y-2 text-gray-400 mb-6">
              <p>Rol: <span className="text-white">{character.role}</span></p>
              <p>Facción: <span className="text-white">{character.faction}</span></p>
            </div>
            <blockquote className="text-xl italic border-l-4 border-accent-primary pl-4 mb-8">
              "{character.quote}"
            </blockquote>
            <div className="flex flex-wrap gap-2">
              {character.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-sm">{tag}</span>
              ))}
            </div>
          </motion.div>
        </aside>

        {/* Derecha: Lore */}
        <section>
          <LoreRenderer content={character.content} />
          
          {/* Navegación */}
          <div className="mt-20 flex justify-between border-t border-white/10 pt-8">
            {allChars[currentIndex - 1] ? (
              <Link to={`/juego/${gameSlug}/${allChars[currentIndex - 1].slug}`} className="flex items-center gap-2 hover:text-accent-primary transition-colors">
                <ChevronLeft /> {allChars[currentIndex - 1].name}
              </Link>
            ) : <div />}
            {allChars[currentIndex + 1] ? (
              <Link to={`/juego/${gameSlug}/${allChars[currentIndex + 1].slug}`} className="flex items-center gap-2 hover:text-accent-primary transition-colors">
                {allChars[currentIndex + 1].name} <ChevronRight />
              </Link>
            ) : <div />}
          </div>
        </section>
      </div>
    </div>
  );
};
```

### src/pages/NotFound.tsx
```tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center px-6">
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-9xl font-bold text-accent-primary"
      >
        404
      </motion.h1>
      <p className="text-2xl mt-4 mb-8">Te has perdido en un mundo sin lore.</p>
      <Link to="/" className="px-8 py-3 bg-white text-dark rounded-full font-bold hover:bg-accent-secondary transition-colors">
        Volver al inicio
      </Link>
    </div>
  );
};
```

## 3. CONTENIDO DE ARCHIVOS .md

### content/hollow-knight/_game.md
```markdown
---
title: Hollow Knight
slug: hollow-knight
cover: /images/hollow-knight/cover.jpg
description: Una aventura épica en el reino decadente de Hallownest.
year: 2017
developer: Team Cherry
genre: Metroidvania
themeColor: #f59e0b
---
```

### content/hollow-knight/hornet.md
```markdown
---
name: Hornet
slug: hornet
game: hollow-knight
role: Protectora
faction: Hallownest
quote: "Git gud!"
cover: /images/hollow-knight/hornet.jpg
gallery: []
tags: [protectora, guardiana]
order: 2
themeColor: #ef4444
---

La protectora de las ruinas de Hallownest, Hornet blande su aguja con precisión letal. Vigilante ante cualquiera que se atreva a profanar los restos de su reino, observa los pasos del recipiente con cautela.
```

### content/hollow-knight/the-knight.md
```markdown
---
name: The Knight
slug: the-knight
game: hollow-knight
role: Protagonista
faction: Ninguna
quote: "No voz para gritar."
cover: /images/hollow-knight/knight.jpg
gallery: []
tags: [protagonista, recipiente]
order: 1
themeColor: #ffffff
---

El Caballero es un ser pequeño y silencioso, un recipiente vacío creado para sellar la infección que consume Hallownest. Su viaje es uno de autodescubrimiento y sacrificio, vagando por los rincones olvidados del reino.
```

## 4. RESUMEN DEL ESTADO

- **Dependencias**: Consulte la sección `package.json` arriba.
- **Problemas**: No hay errores o advertencias reportados en el panel de problemas del entorno de desarrollo.
- **Workflow GitHub**: El archivo de configuración no existe en la ruta `.github/workflows/deploy.yml`.
