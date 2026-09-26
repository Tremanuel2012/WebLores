import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getAllGames, getAllCharacters, getGameBySlug } from "../lib/content";
import { Image } from "../components/Image";

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
              <Image
                src={game.cover}
                alt={game.title}
                className="w-full h-64 rounded-xl"
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
          {[...characters, ...characters].map((char, i) => {
            const gameTitle = getGameBySlug(char.game)?.title || char.game;
            return (
              <Link
                key={i}
                to={`/juego/${char.game}/${char.slug}`}
                className="min-w-[200px] p-4 border border-white/10 rounded-xl bg-dark hover:border-accent-primary transition-colors"
              >
                <p className="font-bold">{char.name}</p>
                <p className="text-xs text-accent-primary">{gameTitle}</p>
              </Link>
            );
          })}
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