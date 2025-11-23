import { useState, useRef } from 'react';
import { Upload, Download, Trash2, ImageIcon, Puzzle, Wand2, Zap, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { PuzzlePage } from './components/PuzzlePage';
import { ImageGallery } from './components/ImageGallery';
import '@tensorflow/tfjs';
import GradientText from './components/GradientText';
import * as bodyPics from '@tensorflow-models/body-pix';

type Page = 'home' | 'puzzle';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToFooter = () => {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (currentPage === 'puzzle') {
    return <PuzzlePage onNavigateHome={() => setCurrentPage('home')} />;
  }

  // --- Logic Handlers ---
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor sube un archivo de imagen válido');
      return;
    }
    setError(null);
    setProcessedImage(null);
    setProgress(0);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      setOriginalImage(imageDataUrl);
      await processImage(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;
    await handleFile(droppedFiles[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    setProgress(10);
    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const blob = await removeBackground(imageUrl);
      clearInterval(progressInterval);
      setProgress(100);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      console.error('Error removing background:', err);
      setError('No se pudo eliminar el fondo. Por favor intenta con otra imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  const removeBackground = async (imageUrl: string): Promise<Blob> => {
    return new Promise<Blob>(async (resolve, reject) => {
      try {
        setProgress(20);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        await new Promise<void>((res, rej) => {
          img.onload = () => res();
          img.onerror = (e) => rej(new Error('Error loading image'));
        });
        setProgress(30);

        const net = await bodyPics.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          multiplier: 0.75,
          quantBytes: 2,
        } as any);
        setProgress(50);

        const segmentation = await net.segmentPerson(img, {
          internalResolution: 'medium',
          segmentationThreshold: 0.7,
          maxDetections: 1,
        } as any);
        setProgress(70);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('No canvas context');

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;
        const mask = segmentation.data;
        const pixelCount = canvas.width * canvas.height;

        for (let i = 0; i < pixelCount; i++) {
          const alphaIndex = i * 4 + 3;
          if (mask[i] === 0) {
            pixelData[alphaIndex] = 0;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        setProgress(90);

        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error('toBlob failed'));
        }, 'image/png');
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    link.click();
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
      
     {/* --- NAVBAR FIXED --- */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo (Clickable to go Home) */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => setCurrentPage('home')}
          >
            <GradientText 
              colors={["#1E88E5", "#4f79ff", "#8E24AA", "#4079ff", "#F024ff"]}
              animationSpeed={8}
              showBorder={false}
              className="font-bold text-2xl tracking-tighter custom-class"
            >
              BREAKMIND
            </GradientText>
          </div>
          
          {/* Navigation Links - Top Right */}
          <nav className="flex items-center gap-1 sm:gap-6">
            <button 
              onClick={() => setCurrentPage('home')} 
              className={`selected px-4 py-2 text-sm font-medium rounded-full transition-all float-left ${
                currentPage === 'home' 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 hover:text-primary hover:bg-slate-50'
              }`}
            >
              Eliminar Fondo
            </button>

            {/* THE PUZZLE BUTTON */}
            <button 
              onClick={() => setCurrentPage('puzzle')} 
              className={`bechamel group px-4 py-2 text-sm font-medium rounded-full transition-all flex items-center gap-2 ${
                currentPage === 'puzzle' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'text-slate-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Puzzle className={`w-4 h-4 transition-transform group-hover:rotate-12 ${currentPage === 'puzzle' ? 'fill-current' : ''}`} />
              Rompecabezas
            </button>

            <button 
              onClick={scrollToFooter} 
              className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
            >
              Nosotros
            </button>
          </nav>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12 flex flex-col items-center">
            
            {/* ICON RESTORED (Purple Gradient Box) */}
            <div className="mb-6 p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-purple-200 transform hover:scale-105 transition-transform duration-300">
                <ImageIcon className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                Eliminador de Fondo
            </h1>
            
        {/* BADGES FIXED: Using custom CSS classes for better color pop */}
            <div className="flex items-center justify-center gap-4 mb-8">
                <span className="badge-ai">
                    <Wand2 className="w-4 h-4" /> IA Avanzada
                </span>
                <span className="badge-free">
                    <Zap className="w-4 h-4" /> 100% Gratis
                </span>
            </div>

            <p className="text-lg text-slate-500 max-w-2xl">
                Sube una imagen y elimina su fondo al instante con tecnología de IA
            </p>
        </div>

        {/* Upload & Processing Area */}
        <div className="max-w-4xl mx-auto">
            {!originalImage && (
            <div className='animate-in fade-in slide-in-from-bottom-4 duration-700'>
                <Card 
                    className={`p-10 border-2 border-dashed transition-all duration-300 ${isDragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-slate-200 hover:border-primary/50"}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                >
                    <input
                        id="app-file-input"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    <label htmlFor="app-file-input" className="cursor-pointer block w-full">
                        <div className="flex flex-col items-center gap-6 py-8">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform border border-slate-100">
                                <Upload className="w-8 h-8 text-slate-400" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-semibold text-slate-700">
                                Haz clic para subir o arrastra y suelta
                                </p>
                                <p className="text-slate-400">
                                PNG, JPG, WEBP hasta 10MB
                                </p>
                            </div>
                            <Button className='bg-slate-900 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all' type="button" onClick={() => fileInputRef.current?.click()}>
                                Elegir Imagen
                            </Button>
                        </div>
                    </label>
                </Card>
                
                {/* --- The Carousel (Now with squares) --- */}
                <ImageGallery 
                    onSelect={(url) => {
                        setOriginalImage(url);
                        processImage(url);
                    }} 
                    disabled={isProcessing}
                />
            </div>
            )}

            {/* Processing State */}
            {isProcessing && (
            <Card className="p-12 text-center border-none shadow-xl bg-white/50 backdrop-blur-sm">
                <div className="max-w-md mx-auto space-y-6">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <ImageIcon className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Procesando tu imagen...</h3>
                        <Progress value={progress} className="h-2 w-full" />
                        <p className="text-sm text-slate-400 mt-2">{progress}% Completado</p>
                    </div>
                </div>
            </Card>
            )}

            {/* Error Message */}
            {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center animate-shake">
                {error}
            </div>
            )}

            {/* Result View */}
            {originalImage && !isProcessing && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="grid md:grid-cols-2 gap-8">
                {/* Original */}
                <Card className="overflow-hidden border-0 shadow-lg group">
                    <div className="p-4 bg-white border-b flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-400"></div>
                        <h3 className="font-semibold text-slate-600">Original</h3>
                    </div>
                    <div className="relative h-[400px] bg-slate-50 flex items-center justify-center p-4">
                        <img src={originalImage} alt="Original" className="max-w-full max-h-full object-contain shadow-sm" />
                    </div>
                </Card>

                {/* Processed */}
                <Card className="overflow-hidden border-0 shadow-lg ring-2 ring-purple-100">
                    <div className="p-4 bg-white border-b flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            <h3 className="font-semibold text-purple-600">Fondo Eliminado</h3>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Listo</span>
                    </div>
                    <div className="relative h-[400px] bg-checkerboard flex items-center justify-center p-4">
                    {processedImage && (
                        <img src={processedImage} alt="Procesada" className="max-w-full max-h-full object-contain drop-shadow-2xl" />
                    )}
                    </div>
                </Card>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className='bg-slate-900 hover:bg-slate-800 h-12 px-8 text-lg shadow-xl hover:translate-y-[-2px] transition-all' onClick={handleDownload}>
                    <Download className="w-5 h-5 mr-2" /> Descargar HD
                </Button>
                <Button className='h-12 px-8 text-lg border-2 hover:bg-slate-50' onClick={handleReset} variant="outline">
                    <Trash2 className="w-5 h-5 mr-2" /> Nueva Imagen
                </Button>
                </div>
            </div>
            )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer id="footer" className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Síguenos en Redes Sociales</h2>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white hover:text-purple-600 transition-all">
                                <Icon className="w-6 h-6" />
                            </a>
                        ))}
                    </div>
                </div>
                <div className="space-y-4 text-white/90">
                    <h3 className="text-2xl font-bold">Quiénes Somos</h3>
                    <p className="leading-relaxed">
                        Somos un equipo de desarrolladores, diseñadores y analistas comprometidos con crear herramientas web innovadoras que transformen la manera en que interactúas con tus imágenes y tu imaginación.
                    </p>
                </div>
            </div>
            <div className="border-t border-white/20 mt-12 pt-8 flex justify-between items-center text-sm text-white/60">
                <p>© 2025 Breakmind. Todos los derechos reservados.</p>
                <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowUp className="w-5 h-5" />
                </button>
            </div>
        </div>
      </footer>

      <style>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #cbd5e1 25%, transparent 25%),
            linear-gradient(-45deg, #cbd5e1 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #cbd5e1 75%),
            linear-gradient(-45deg, transparent 75%, #cbd5e1 75%);
                  background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}
