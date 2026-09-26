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
