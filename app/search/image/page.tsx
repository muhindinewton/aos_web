'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, Upload, X, RotateCcw, Search, Scan } from 'lucide-react';
import { products } from '../../lib/data';
import { ProductCard } from '../../components/product-card';

type Mode = 'camera' | 'results';

export default function ImageSearchPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<Mode>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [results, setResults] = useState<typeof products>([]);

  const startCamera = async (fm = facingMode) => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: fm, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraError(null);
    } catch {
      setCameraError('Camera access denied. Please allow camera permissions or upload an image.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  const flipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const mockSearch = () => {
    setScanning(true);
    setTimeout(() => {
      const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 8);
      setResults(shuffled);
      setScanning(false);
      setMode('results');
    }, 2000);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg');
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCapturedImage(dataUrl);
    mockSearch();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCapturedImage(url);
    mockSearch();
  };

  const reset = () => {
    setCapturedImage(null);
    setResults([]);
    setMode('camera');
    startCamera();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <span className="text-white text-sm font-semibold bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
          Image Search
        </span>
        {mode === 'camera' && (
          <button
            onClick={flipCamera}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm"
          >
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
        )}
        {mode === 'results' && (
          <button
            onClick={reset}
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Camera / Image view */}
      <div className="relative w-full" style={{ height: '55dvh' }}>
        {mode === 'camera' && !capturedImage && (
          <video
            ref={videoRef}
            autoPlay playsInline muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {capturedImage && (
          <img src={capturedImage} alt="captured" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <canvas ref={canvasRef} className="hidden" />

        {/* Camera error */}
        {cameraError && !capturedImage && (
          <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-4 p-6">
            <Camera className="w-16 h-16 text-white/20" />
            <p className="text-white/60 text-sm text-center">{cameraError}</p>
          </div>
        )}

        {/* Scanning frame overlay */}
        {mode === 'camera' && !capturedImage && !cameraError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-64 h-64">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/70 text-xs font-medium">Point at a product</p>
              </div>
            </div>
          </div>
        )}

        {/* Scanning animation */}
        {scanning && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <Scan className="w-14 h-14 text-primary animate-pulse" />
            <div className="flex flex-col items-center gap-2">
              <p className="text-white text-base font-semibold">Analyzing image...</p>
              <p className="text-white/60 text-xs">Finding similar products</p>
            </div>
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-[scan_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        {/* Gradient bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      {/* Camera controls */}
      {mode === 'camera' && (
        <div className="flex items-center justify-center gap-8 py-8 bg-black">
          <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <button
            onClick={() => uploadRef.current?.click()}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/60 text-xs">Upload</span>
          </button>

          <button
            onClick={capturePhoto}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Camera className="w-8 h-8 text-white" />
          </button>

          <div className="w-14 h-14" />
        </div>
      )}

      {/* Results panel */}
      {mode === 'results' && results.length > 0 && (
        <div className="flex-1 bg-theme rounded-t-3xl -mt-4 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-theme-primary">
                {results.length} visually similar products
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pb-24">
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
