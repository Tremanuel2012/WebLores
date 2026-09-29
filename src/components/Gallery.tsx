import { useState, useEffect, useRef } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Image } from './Image';
import { Lightbox } from './Lightbox';

interface GalleryProps {
  images: string[];
}

export const Gallery = ({ images }: GalleryProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setSlideWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!images || images.length === 0) return null;

  const total = images.length;

  const next = () => {
    setCurrentSlide((prev) => (prev + 1) % total);
  };

  const prev = () => {
    setCurrentSlide((prev) => (prev - 1 + total) % total);
  };

  const handleDragStart = () => {
    draggedRef.current = true;
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) {
      next();
    } else if (info.offset.x > threshold) {
      prev();
    }
    // Resetear tras un pequeño delay para que el onClick no se dispare
    setTimeout(() => {
      draggedRef.current = false;
    }, 100);
  };

  const handleImageClick = (index: number) => {
    if (draggedRef.current) return;
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-8">Galería</h2>

      {/* Contenedor del Carrusel */}
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden"
      >
        {/* Flechas de Navegación */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:bg-accent-primary"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-all opacity-0 group-hover:opacity-100 hover:bg-accent-primary"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        )}

        {/* Slides */}
        <motion.div
          className="flex cursor-grab active:cursor-grabbing select-none"
          style={{ touchAction: 'pan-y' }}
          drag="x"
          dragDirectionLock={true}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          animate={{ x: -currentSlide * slideWidth }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="w-full shrink-0 px-2 sm:px-4"
              onClick={() => handleImageClick(i)}
            >
              <div className="w-[85%] md:w-[60%] mx-auto overflow-hidden rounded-2xl">
                <Image
                  src={img}
                  alt={`Imagen ${i + 1}`}
                  className="w-full h-[60vh] object-cover"
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicadores */}
      {total > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? 'w-8 bg-accent-primary'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox existente */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(i) => setLightboxIndex(i)}
        />
      )}
    </div>
  );
};

