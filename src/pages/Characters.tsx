import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, X, AlertCircle } from 'lucide-react';
import { getAllCharacters, getAllGames, getGameBySlug } from '../lib/content';
import { Image } from '../components/Image';

export const Characters = () => {
  const characters = getAllCharacters();
  const games = getAllGames();
  const [search, setSearch] = useState('');
  const [filterGame, setFilterGame] = useState('Todos');

  const filteredCharacters = characters.filter(c => 
    (filterGame === 'Todos' || c.game === filterGame) &&
    (c.name || '').toLowerCase().includes((search || '').toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">Directorio de Personajes</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Buscar personaje..." 
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
          onChange={(e) => setFilterGame(e.target.value)}
          value={filterGame}
        >
          <option value="Todos">Todos los juegos</option>
          {games.map(g => <option key={g.slug} value={g.slug}>{g.title}</option>)}
        </select>
      </div>

      <p className="text-gray-500 text-sm mb-6">
        Mostrando {filteredCharacters.length} {filteredCharacters.length === 1 ? 'personaje' : 'personajes'}
      </p>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCharacters.length > 0 ? (
            filteredCharacters.map(char => {
              const game = getGameBySlug(char.game);
              return (
                <motion.div 
                  key={`${char.game}-${char.slug}`} 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="border border-white/10 rounded-2xl p-4 bg-white/5 hover:border-white/20 transition-colors"
                >
                  <Link to={`/juego/${char.game}/${char.slug}`}>
                    <Image src={char.cover} alt={char.name} className="w-full h-64 rounded-xl mb-4" />
                    <h2 className="text-xl font-bold">{char.name || 'Sin nombre'}</h2>
                    <p className="text-sm text-gray-400">{char.role || 'Sin rol definido'}</p>
                    <p className="text-xs text-accent-primary font-medium mb-4">{game?.title || 'Juego desconocido'}</p>
                    <div className="block text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-semibold transition-colors">Ver Lore</div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500"
            >
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p>No se encontraron personajes que coincidan con tu búsqueda.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

