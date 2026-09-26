import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const GlitchText = ({ text }: { text: string }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <motion.span
      className="inline-block cursor-default"
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
      animate={isGlitching ? {
        x: [0, -2, 2, -2, 0],
        skewX: [0, 10, -10, 0],
      } : {}}
      transition={{ duration: 0.3 }}
    >
      {text}
    </motion.span>
  );
};
