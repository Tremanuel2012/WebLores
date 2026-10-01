# CONTEXTO COMPLETO — WebLores (Parte 3 de 3)

## BLOQUE 3 — Componentes y páginas

### src/components/CustomCursor.tsx
- **Propósito**: Cursor personalizado en escritorio (oculto en móvil).
- **Comportamiento**: Usa `framer-motion` con `useSpring` para suavizar el movimiento. Escala al hacer hover sobre enlaces o botones.

### src/components/Gallery.tsx
- **Propósito**: Carrusel interactivo para imágenes.
- **Comportamiento**: Soporta drag, navegación con flechas y puntos. Usa píxeles para el drag.

### src/components/GlitchText.tsx
- **Propósito**: Efecto visual de glitch en texto.
- **Props**: `text: string`.
- **Comportamiento**: Animación de desplazamiento (x/skew) al hacer hover.

### src/components/GlobalBackground.tsx
- **Propósito**: Fondo decorativo constante con blobs y rejilla.
- **Comportamiento**: Animaciones infinitas CSS/Framer para blobs; rejilla definida en CSS.

### src/components/Image.tsx
- **Propósito**: Imagen optimizada con lazy loading.
- **Props**: `src`, `alt`, `className`.
- **Comportamiento**: Muestra placeholder de carga (pulse) antes de que la imagen esté lista.

### src/components/Layout.tsx
- **Propósito**: Contenedor principal de la página.
- **Comportamiento**: Contiene Navbar, Footer, progreso de scroll, `AnimatePresence` para transiciones de ruta (`Outlet`).

### src/components/LayoutWrapper.tsx
- **Propósito**: Envoltorio para inicializar Lenis (scroll suave).
- **Comportamiento**: Instancia y destruye Lenis globalmente.

### src/components/Lightbox.tsx
- **Propósito**: Modal de visualización de imágenes.
- **Comportamiento**: Soporta gestos táctiles. Botones fuera de `motion.div` draggable. Evita scroll global con `data-lenis-prevent`.

### src/components/Loader.tsx
- **Propósito**: Pantalla de carga inicial.
- **Comportamiento**: Animación de "L" rotando; solo en primera visita (sessionStorage).

### src/components/LoreRenderer.tsx
- **Propósito**: Renderizado de Markdown.
- **Props**: `content: string`.
- **Comportamiento**: Usa `react-markdown` + `remark-gfm` bajo clase `.prose`.

### src/components/MobileParticles.tsx
- **Propósito**: Grid de partículas para móviles.
- **Comportamiento**: Genera 25 partículas (DOM) con animación `particle-pulse` (CSS).

### src/components/ParticleBackground.tsx
- **Propósito**: Canvas de partículas para escritorio (≥ 768px).
- **Comportamiento**: Animación de canvas basada en RAF.

### src/components/ScrollToTop.tsx
- **Propósito**: Resetea el scroll al cambiar de ruta.

---

## BLOQUE 3.B — Componentes clave (código en crudo)
Estos son los componentes más críticos del proyecto. Se pegan completos porque su lógica es no trivial y no debe reinventarse.

**src/components/Layout.tsx**
```tsx
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation, useOutlet } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const Layout = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [showTopBtn, setShowTopBtn] = useState(false);
  const location = useLocation();
  const outlet = useOutlet();

  useEffect(() => {
    window.addEventListener('scroll', () => setShowTopBtn(window.scrollY > 400));
  }, []);

  const navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Juegos', path: '/games' },
    { label: 'Personajes', path: '/personajes' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark text-gray-100 overflow-x-hidden selection:bg-accent-primary/30">
      {/* Scroll Progress */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-accent-primary origin-left z-50" style={{ scaleX }} />

      {/* Navbar */}
      <nav className="fixed w-full backdrop-blur-md bg-dark/50 z-40 border-b border-white/10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">LoreHub</Link>
          <div className="flex gap-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`transition-colors ${
                  isActive(item.path) 
                    ? 'text-accent-primary font-semibold' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
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

**src/components/LoreRenderer.tsx**
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

**src/components/Gallery.tsx**
```tsx
import { useState, useEffect, useRef } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from './Image';
import { Lightbox } from './Lightbox';

interface GalleryProps {
  images: string[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!images || images.length === 0) return null;

  const total = images.length;

  const next = () => {
    setCurrentSlide((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  };

  const handleDragStart = () => {
    draggedRef.current = true;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      next();
    } else if (info.offset.x > threshold) {
      prev();
    }
    // Resetear tras un pequeño delay para que el onClick no se dispare
    setTimeout(() => {
      draggedRef.current = false;
    }, 100);
  };

  const handleImageClick = (index: number) => {
    if (draggedRef.current) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-8">Galería</h2>

      {/* Contenedor del Carrusel */}
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden"
      >
        {/* Flechas de Navegación */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:bg-accent-primary"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:bg-accent-primary"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        )}

        {/* Slides */}
        <motion.div
          className="flex cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'pan-y' }}
          drag="x"
          dragDirectionLock={true}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{ x: -currentSlide * slideWidth }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="w-full shrink-0 px-2 sm:px-4"
              onClick={() => handleImageClick(i)}
            >
              <div className="w-[85%] md:w-[60%] mx-auto overflow-hidden rounded-2xl">
                <Image
                  src={img}
                  alt={`Imagen ${i + 1}`}
                  className="w-full h-[60vh] object-cover"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicadores */}
      {total > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-8 bg-accent-primary'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox existente */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  );
};
```

**src/components/Lightbox.tsx**
```tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox = ({ images, currentIndex, onClose, onNavigate }: LightboxProps) => {
  const [index, setIndex] = useState(currentIndex);

  const navigate = (newIndex: number) => {
    setIndex(newIndex);
    onNavigate(newIndex);
  };

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigate(index > 0 ? index - 1 : images.length - 1);
      if (e.key === 'ArrowRight') navigate(index < images.length - 1 ? index + 1 : 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, images.length, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        data-lenis-prevent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <button
          data-lenis-prevent
          className="absolute top-6 right-6 text-white/70 hover:text-white cursor-pointer p-3"
                onClick={(e) => {
                  e.preventDefault();
            onClose();
                }}
              >
          <X size={32} />
        </button>

        <div className="relative max-h-[85vh] max-w-[90vw]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) {
              navigate(index < images.length - 1 ? index + 1 : 0);
            } else if (info.offset.x > 80) {
              navigate(index > 0 ? index - 1 : images.length - 1);
            }
                }}
          style={{ touchAction: 'pan-y' }}
              >
          <img
            src={images[index]}
            alt={`Galería ${index + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
      </motion.div>

          {images.length > 1 && (
            <>
              <button
                data-lenis-prevent
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer p-3"
                onClick={() => navigate(index > 0 ? index - 1 : images.length - 1)}
              >
                <ChevronLeft size={48} />
              </button>
              <button
                data-lenis-prevent
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer p-3"
                onClick={() => navigate(index < images.length - 1 ? index + 1 : 0)}
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
```

**src/components/MobileParticles.tsx**
```tsx
import { useState } from 'react';

export const MobileParticles = () => {
  // Generamos las posiciones y tiempos de animación solo una vez
  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => {
      const col = i % 5;
      const row = Math.floor(i / 5);
      return {
        top: row * 20 + 10 + (Math.random() * 12 - 6),
        left: col * 20 + 10 + (Math.random() * 12 - 6),
      dur: Math.random() * 2.5 + 2.5,
      delay: Math.random() * 3,
};
    })
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            ['--duration' as any]: `${p.dur}s`,
            ['--delay' as any]: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
```

INSTRUCCIONES PARA EL ASISTENTE
Eres un asistente técnico que continuará el desarrollo de WebLores. Has
recibido las 3 partes del contexto completo al inicio del chat. Antes de
proponer cambios:

Verifica que entiendes la arquitectura de contenido (content/games/ y
content/characters/).

Recuerda:

HashRouter (no BrowserRouter).

Tailwind v4 sin tailwind.config.js (config vía @theme en CSS).

@plugin "@tailwindcss/typography"; activo en index.css.

Decap CMS con Netlify Identity + Git Gateway.

El CMS guarda imágenes en public/images/uploads, que luego se mueven
con npm run organize.

Flujo del autor:

Crear contenido → CMS panel.

Ejecutar npm run organize (y npm run sync si es juego nuevo).

Esperar deploy de GitHub Actions (~1-2 min).

Si necesitas ver el contenido de algún archivo concreto, PÍDELO antes
de proponer cambios que dependan de él.

NO inventes nombres de archivos, funciones o props. Si dudas, pregunta.

