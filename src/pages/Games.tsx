import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, X, AlertCircle } from 'lucide-react';
import { getAllGames } from '../lib/content';
import { Image } from '../components/Image';

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
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar juego..." 
            value={search}
            className="w-full bg-white/5 border border-white/10 p-3 pl-10 rounded-xl focus:outline-none focus:border-accent-primary transition-colors"
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <select 
          className="bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-accent-primary transition-colors" 
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <p className="text-gray-500 text-sm mb-6">
        Mostrando {filteredGames.length} {filteredGames.length === 1 ? 'juego' : 'juegos'}
      </p>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredGames.length > 0 ? (
            filteredGames.map(game => (
              <motion.div 
                key={game.slug} 
                layout
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="border border-white/10 rounded-2xl p-4 bg-white/5 hover:border-white/20 transition-colors"
              >
                <Image src={game.cover} alt={game.title} className="w-full h-48 rounded-xl mb-4" />
                <h2 className="text-xl font-bold">{game.title}</h2>
                <p className="text-sm text-gray-400 mb-4">{game.genre}</p>
                <Link to={`/juego/${game.slug}`} className="block text-center py-2 bg-accent-primary hover:bg-accent-secondary rounded-lg text-sm font-semibold transition-colors">Ver Lore</Link>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500"
            >
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p>No se encontraron juegos que coincidan con tu búsqueda.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

