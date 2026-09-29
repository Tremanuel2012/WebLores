import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox = ({ images, currentIndex, onClose, onNavigate }: LightboxProps) => {
  const [index, setIndex] = useState(currentIndex);

  const navigate = (newIndex: number) => {
    setIndex(newIndex);
    onNavigate(newIndex);
  };

  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigate(index > 0 ? index - 1 : images.length - 1);
      if (e.key === 'ArrowRight') navigate(index < images.length - 1 ? index + 1 : 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, images.length, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        data-lenis-prevent
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <button
          data-lenis-prevent
          className="absolute top-6 right-6 text-white/70 hover:text-white cursor-pointer p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
            onClose();
                }}
              >
          <X size={32} />
        </button>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-h-[85vh] max-w-[90vw]"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -80) {
              navigate(index < images.length - 1 ? index + 1 : 0);
            } else if (info.offset.x > 80) {
              navigate(index > 0 ? index - 1 : images.length - 1);
            }
                }}
          onClick={(e) => e.stopPropagation()}
          style={{ touchAction: 'pan-y' }}
              >
          <img
            src={images[index]}
            alt={`Galería ${index + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />

          {images.length > 1 && (
            <>
              <button
                data-lenis-prevent
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(index > 0 ? index - 1 : images.length - 1);
                }}
              >
                <ChevronLeft size={48} />
              </button>
              <button
                data-lenis-prevent
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white cursor-pointer p-3"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  navigate(index < images.length - 1 ? index + 1 : 0);
                }}
              >
                <ChevronRight size={48} />
              </button>
            </>
          )}

          <div className="absolute -bottom-10 left-0 right-0 text-center text-white/70">
            {index + 1} / {images.length}
          </div>
      </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


