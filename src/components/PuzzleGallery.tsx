import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Loader2, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

// Using the HUMAN ONLY images
const SAMPLE_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1763669029223-74f911a9e08b?auto=format&fit=crop&w=600&q=80", label: "Retrato Mujer" },
  { id: 2, url: "https://images.unsplash.com/photo-1762170905134-e9e3b5692286?auto=format&fit=crop&w=600&q=80", label: "Retrato Hombre" },
  { id: 3, url: "https://images.unsplash.com/photo-1761675688044-0eb981b90481?auto=format&fit=crop&w=600&q=80", label: "Modelo Urbano" },
  { id: 4, url: "https://images.unsplash.com/photo-1763431921801-8dfc1bac8793?auto=format&fit=crop&w=600&q=80", label: "Sonrisa" },
  { id: 5, url: "https://images.unsplash.com/photo-1757952400950-f8c04fd7a104?auto=format&fit=crop&w=600&q=80", label: "Casual" },
  { id: 6, url: "https://images.unsplash.com/photo-1761438180295-9ea187978263?auto=format&fit=crop&w=600&q=80", label: "Retrato" },
  { id: 7, url: "https://images.unsplash.com/photo-1760434875920-2b7a79ea163a?auto=format&fit=crop&w=600&q=80", label: "Perfil" },
  { id: 8, url: "https://images.unsplash.com/photo-1760930380017-b0f1fdad0242?auto=format&fit=crop&w=600&q=80", label: "Usuario" },
  { id: 9, url: "https://images.unsplash.com/photo-1760715756584-9a88f2b272c6?auto=format&fit=crop&w=600&q=80", label: "forest" },
];

interface PuzzleGalleryProps {
  onSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

export function PuzzleGallery({ onSelect, disabled }: PuzzleGalleryProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  
  // Initialize Embla Carousel
  // align: 'start' keeps items aligned to the left
  // dragFree: true allows free scrolling (optional, remove for snap-only)
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });
  
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelectEmbla = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelectEmbla();
    emblaApi.on('select', onSelectEmbla);
    emblaApi.on('reInit', onSelectEmbla);
  }, [emblaApi, onSelectEmbla]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const handleSelect = async (id: number, url: string) => {
    try {
      setLoadingId(id);
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      onSelect(objectUrl);
    } catch (error) {
      console.error("Error loading sample image:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full mt-8 border-t border-slate-100 pt-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between mb-4 px-1">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <ImageIcon className="w-4 h-4" />
                <span>Prueba rápida:</span>
            </div>
            
            {/* Controls */}
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full" 
                    onClick={scrollPrev}
                    disabled={!canScrollPrev}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full" 
                    onClick={scrollNext}
                    disabled={!canScrollNext}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
        
        {/* Embla Viewport (This hides the overflow) */}
        <div className="overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="flex gap-4 touch-pan-y">
                {SAMPLE_IMAGES.map((img) => (
                <div className="flex-[0_0_auto] min-w-0" key={img.id}>
                    <button
                        onClick={() => handleSelect(img.id, img.url)}
                        disabled={disabled || loadingId !== null}
                        className="relative rounded-xl overflow-hidden border-2 border-slate-100 hover:border-primary hover:shadow-md hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 group bg-slate-100"
                        style={{ width: '140px', height: '140px' }} // Safe 140px size
                    >
                        <img 
                            src={img.url} 
                            alt={img.label} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                        
                        {loadingId === img.id && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        )}
                    </button>
                </div>
                ))}
            </div>
        </div>
    </div>
  );
}

