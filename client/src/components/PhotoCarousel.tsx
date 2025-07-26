
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Eye, ZoomIn, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { PhotoCarousel as PhotoCarouselType } from "@shared/schema";
import { processTextWithGradient, BADGE_GRADIENTS } from "@/utils/textGradient";

export function PhotoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Buscar fotos do carrossel
  const { data: photos = [], isLoading } = useQuery<PhotoCarouselType[]>({
    queryKey: ["/api/photo-carousel"],
    queryFn: async () => {
      const response = await fetch("/api/photo-carousel");
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      return response.json();
    },
  });

  // Buscar configurações da seção de galeria
  const { data: configs } = useQuery({
    queryKey: ["/api/admin/config"],
    queryFn: async () => {
      const response = await fetch("/api/admin/config");
      if (!response.ok) {
        throw new Error('Failed to fetch config');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const photoCarouselConfig = configs?.find((c: any) => c.key === 'photo_carousel_section' || c.key === 'carousel_section')?.value as any || {};

  // Obtém o gradiente dos badges
  const badgeGradient = configs?.find(c => c.key === 'badge_gradient')?.value?.gradient;

  const activePhotos = photos.filter(photo => photo.isActive).sort((a, b) => a.order - b.order);

  // Auto play do carrossel
  useEffect(() => {
    if (isAutoPlaying && activePhotos.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activePhotos.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, activePhotos.length]);

  // Pausar auto play quando mouse está sobre o carrossel
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Navegação manual
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % activePhotos.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + activePhotos.length) % activePhotos.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 4000);
  };

  // Touch/swipe para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (activePhotos.length === 0) {
    return null;
  }

  return (
    <>
      <section 
        id="gallery" 
        data-section="gallery"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50/50 via-white to-purple-50/30 relative overflow-hidden"
        ref={sectionRef}
      >
        {/* Background decorativo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-100/20 to-pink-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
          {/* Header da seção */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className={`text-xs font-semibold text-white px-6 py-2 rounded-full bg-gradient-to-r ${badgeGradient ? BADGE_GRADIENTS[badgeGradient as keyof typeof BADGE_GRADIENTS] || 'from-pink-500 to-purple-600' : 'from-pink-500 to-purple-600'} shadow-lg`}>
                {photoCarouselConfig.badge || "GALERIA"}
              </span>
            </div>

            {/* Título */}
            <h2 className="font-light text-4xl sm:text-5xl lg:text-6xl text-gray-800 mb-6 tracking-tight leading-tight">
              {processTextWithGradient(photoCarouselConfig.title || "Galeria de (fotos)", badgeGradient)}
            </h2>

            {/* Subtítulo */}
            <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed font-light">
              {photoCarouselConfig.subtitle || "Um olhar pelo ambiente acolhedor onde acontece o cuidado"}
            </p>

            {/* Linha decorativa */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-300 to-purple-300"></div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>
          </motion.div>

          {/* Carrossel principal */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Container do carrossel */}
            <div 
              className="relative rounded-3xl overflow-hidden shadow-2xl bg-white ring-1 ring-gray-200/50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Imagem principal */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.7, 
                      ease: [0.25, 0.1, 0.25, 1]
                    }}
                    className="absolute inset-0"
                  >
                    <img
                      src={activePhotos[currentSlide]?.imageUrl}
                      alt={activePhotos[currentSlide]?.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Overlay gradiente sutil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                    {/* Texto da imagem */}
                    {activePhotos[currentSlide]?.showText && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-12">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            delay: 0.3, 
                            duration: 0.6,
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                          className="text-white max-w-2xl"
                        >
                          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-3 tracking-tight">
                            {activePhotos[currentSlide]?.title}
                          </h3>
                          {activePhotos[currentSlide]?.description && (
                            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed font-light">
                              {activePhotos[currentSlide]?.description}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    )}

                    {/* Botão fullscreen */}
                    <button
                      onClick={toggleFullscreen}
                      className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
                      aria-label="Ver em tela cheia"
                    >
                      <ZoomIn size={20} />
                    </button>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controles de navegação */}
              {activePhotos.length > 1 && (
                <>
                  {/* Setas de navegação */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl z-10"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl z-10"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Controle de play/pause */}
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 z-10"
                    aria-label={isAutoPlaying ? "Pausar slideshow" : "Reproduzir slideshow"}
                  >
                    {isAutoPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </>
              )}

              {/* Indicadores (bolinhas) */}
              {activePhotos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
                  {activePhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`transition-all duration-300 ${
                        index === currentSlide
                          ? "w-8 h-3 bg-white rounded-full"
                          : "w-3 h-3 bg-white/60 hover:bg-white/80 rounded-full hover:scale-125"
                      }`}
                      aria-label={`Ir para foto ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Contador de fotos */}
              {activePhotos.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentSlide + 1} / {activePhotos.length}
                </div>
              )}
            </div>

            {/* Thumbnails (apenas para desktop) */}
            {activePhotos.length > 1 && (
              <div className="hidden lg:flex mt-6 space-x-4 overflow-x-auto pb-2">
                {activePhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => goToSlide(index)}
                    className={`flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-300 ${
                      index === currentSlide 
                        ? "ring-2 ring-purple-500 scale-105 shadow-lg" 
                        : "hover:scale-105 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-20 h-20 object-cover"
                      loading="lazy"
                    />
                    {index === currentSlide && (
                      <div className="absolute inset-0 bg-purple-500/20"></div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Modal fullscreen */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={toggleFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-7xl max-h-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={activePhotos[currentSlide]?.imageUrl}
                alt={activePhotos[currentSlide]?.title}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <button
                onClick={toggleFullscreen}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default PhotoCarousel;
