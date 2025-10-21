import { useState } from 'react';
import { Upload, Download, Trash2, ImageIcon, Puzzle } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { removeBackground } from '@imgly/background-removal';
import { PuzzlePage } from './components/PuzzlePage';

type Page = 'home' | 'puzzle';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (currentPage === 'puzzle') {
    return <PuzzlePage onNavigateHome={() => setCurrentPage('home')} />;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Por favor sube un archivo de imagen válido');
      return;
    }

    // Reset states
    setError(null);
    setProcessedImage(null);
    setProgress(0);

    // Read and display original image
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      setOriginalImage(imageDataUrl);
      
      // Process the image
      await processImage(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageUrl: string) => {
    setIsProcessing(true);
    setProgress(10);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Remove background with single-thread configuration
      const blob = await removeBackground(imageUrl, {
        publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/',
        device: 'cpu',
      });
      clearInterval(progressInterval);
      setProgress(100);

      // Convert blob to data URL
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (err) {
      console.error('Error removing background:', err);
      setError('No se pudo eliminar el fondo. Por favor intenta con otra imagen.');
    } finally {
      setIsProcessing(false);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            breakmind
          </h2>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <ImageIcon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl">Eliminador de Fondo</h1>
          </div>
          <p className="text-muted-foreground">
            Sube una imagen y elimina su fondo al instante
          </p>
        </div>

        {/* Upload Area */}
        {!originalImage && (
          <Card className="p-12 border-2 border-dashed border-border hover:border-primary transition-colors">
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="p-6 bg-muted rounded-full">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="mb-2">
                    Haz clic para subir o arrastra y suelta
                  </p>
                  <p className="text-muted-foreground">
                    PNG, JPG, WEBP hasta 10MB
                  </p>
                </div>
                <Button type="button">
                  Elegir Imagen
                </Button>
              </div>
            </label>
          </Card>
        )}

        {/* Processing Progress */}
        {isProcessing && (
          <Card className="p-8">
            <div className="text-center mb-4">
              <p>Procesando tu imagen...</p>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="text-center text-muted-foreground mt-2">
              {progress}%
            </p>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="p-6 bg-destructive/10 border-destructive">
            <p className="text-destructive text-center">{error}</p>
          </Card>
        )}

        {/* Results */}
        {originalImage && !isProcessing && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original Image */}
              <Card className="overflow-hidden">
                <div className="p-4 bg-muted border-b">
                  <h3>Original</h3>
                </div>
                <div className="p-4 bg-checkerboard min-h-[400px] flex items-center justify-center">
                  <img
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </div>
              </Card>

              {/* Processed Image */}
              <Card className="overflow-hidden">
                <div className="p-4 bg-muted border-b">
                  <h3>Fondo Eliminado</h3>
                </div>
                <div className="p-4 bg-checkerboard min-h-[400px] flex items-center justify-center">
                  {processedImage ? (
                    <img
                      src={processedImage}
                      alt="Procesada"
                      className="max-w-full max-h-[400px] object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground text-center">
                      <ImageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>Procesando...</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleDownload}
                disabled={!processedImage}
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar Resultado
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Subir Nueva Imagen
              </Button>
            </div>
          </div>
        )}

        {/* Puzzle Feature CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-600 rounded-xl">
                <Puzzle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="mb-2">¡Prueba Nuestro Rompecabezas!</h2>
                <p className="text-muted-foreground max-w-xl">
                  Sube cualquier imagen y conviértela en un rompecabezas interactivo. Elige tu nivel de dificultad y pon a prueba tus habilidades resolviendo las piezas mezcladas. ¡Perfecto para desafíos divertidos o entrenar tu reconocimiento espacial!
                </p>
              </div>
            </div>
            <Button
              onClick={() => setCurrentPage('puzzle')}
              size="lg"
              className="shrink-0"
            >
              <Puzzle className="w-5 h-5 mr-2" />
              Crear Rompecabezas
            </Button>
          </div>
        </Card>

        {/* About Section */}
        <div className="mt-12 pb-8 text-center max-w-3xl mx-auto">
          <h3 className="mb-4">Acerca de Esta Aplicación</h3>
          <p className="text-muted-foreground mb-4">
            Esta aplicación web ofrece dos poderosas herramientas para imágenes. El Eliminador de Fondo utiliza tecnología avanzada de IA para detectar y eliminar automáticamente los fondos de tus imágenes, perfecto para crear fotos profesionales de productos, imágenes de perfil o recursos de diseño. La función de Rompecabezas te permite transformar cualquier imagen en un juego de rompecabezas interactivo con niveles de dificultad personalizables.
          </p>
          <p className="text-muted-foreground">
            Todo el procesamiento ocurre directamente en tu navegador, asegurando que tus imágenes permanezcan privadas y seguras. Sin subidas a servidores externos, sin recopilación de datos - solo herramientas de imagen simples y efectivas al alcance de tu mano.
          </p>
        </div>
      </div>

      <style>{`
        .bg-checkerboard {
          background-image: 
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}
