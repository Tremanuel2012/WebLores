import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
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

