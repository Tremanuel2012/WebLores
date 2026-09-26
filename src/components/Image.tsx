import { useState } from 'react';
import { motion } from 'framer-motion';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
}

export const Image = ({ src, alt, className = '', imgClassName = '', aspectRatio = '' }: ImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-white/10" />
      )}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
};
