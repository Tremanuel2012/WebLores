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

