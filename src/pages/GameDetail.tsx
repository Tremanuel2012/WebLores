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

