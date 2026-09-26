import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { getCharacterBySlug, getCharactersByGame } from '../lib/content';
import { LoreRenderer } from '../components/LoreRenderer';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from '../components/Image';

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
            <Image src={character.cover} alt={character.name} className="w-full h-96 rounded-3xl mb-6 shadow-2xl" />
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
          {currentIndex !== -1 && (
            <div className="mt-20 flex items-center justify-between border-t border-white/10 pt-8">
              {currentIndex > 0 ? (
                <motion.div whileHover={{ x: -5 }}>
                  <Link 
                    to={`/juego/${gameSlug}/${allChars[currentIndex - 1].slug}`} 
                    className="flex items-center gap-2 text-gray-400 hover:text-accent-primary transition-colors font-medium"
                  >
                    <ChevronLeft /> {allChars[currentIndex - 1].name}
                  </Link>
                </motion.div>
              ) : <div />}

              <span className="text-gray-500 text-sm font-medium">
                Personaje {currentIndex + 1} de {allChars.length}
              </span>

              {currentIndex < allChars.length - 1 ? (
                <motion.div whileHover={{ x: 5 }}>
                  <Link 
                    to={`/juego/${gameSlug}/${allChars[currentIndex + 1].slug}`} 
                    className="flex items-center gap-2 text-gray-400 hover:text-accent-primary transition-colors font-medium"
                  >
                    {allChars[currentIndex + 1].name} <ChevronRight />
                  </Link>
                </motion.div>
              ) : <div />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

