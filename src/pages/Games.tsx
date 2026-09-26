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
