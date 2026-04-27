'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Video,
  Square,
  RotateCcw,
  Check,
  Camera,
  X,
  Hash,
  AlignLeft,
  ChevronRight,
  Plus,
  Upload,
  Search,
} from 'lucide-react';
import { products } from '../../lib/data';

type RecordState = 'idle' | 'recording' | 'preview' | 'details';
type Speed = 0.5 | 1 | 2 | 3;
const MAX_DESC = 512;
const DURATIONS = [15, 30, 60] as const;
const SPEEDS: Speed[] = [0.5, 1, 2, 3];

export default function ShortVideoPage() {
  const router = useRouter();
  const videoRef    = useRef<HTMLVideoElement>(null);
  const previewRef  = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef   = useRef<Blob[]>([]);
  const streamRef   = useRef<MediaStream | null>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const uploadRef   = useRef<HTMLInputElement>(null);

  const [recState, setRecState]   = useState<RecordState>('idle');
  const [recordedUrl, setUrl]     = useState<string | null>(null);
  const [timer, setTimer]         = useState(0);
  const [maxDur, setMaxDur]       = useState<typeof DURATIONS[number]>(60);
  const [speed, setSpeed]         = useState<Speed>(1);
  const [facingMode, setFacing]   = useState<'user' | 'environment'>('environment');
  const [error, setError]         = useState<string | null>(null);
  const [description, setDesc]    = useState('');
  const [hashtags, setHashtags]   = useState('');
  const [taggedProducts, setTaggedProducts] = useState<string[]>([]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productQuery, setProductQuery] = useState('');

  const startCamera = async (fm = facingMode) => {
    try {
      streamRef.current?.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: fm, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setError(null);
    } catch {
      setError('Camera access denied. Please allow camera permissions.');
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, []);

  useEffect(() => {
    if (recState === 'recording') {
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t + 1 >= maxDur) { stopRecording(); return maxDur; }
          return t + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recState, maxDur]);

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const rec = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
    rec.ondataavailable = e => e.data.size > 0 && chunksRef.current.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setUrl(URL.createObjectURL(blob));
      setRecState('preview');
    };
    recorderRef.current = rec;
    rec.start();
    setTimer(0);
    setRecState('recording');
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

  const retake = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setUrl(null); setTimer(0);
    setRecState('idle');
    startCamera();
  };

  const flipCamera = () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacing(next);
    startCamera(next);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    streamRef.current?.getTracks().forEach(t => t.stop());
    setUrl(URL.createObjectURL(file));
    setRecState('preview');
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const pct = Math.min((timer / maxDur) * 100, 100);

  /* ── DETAILS SCREEN ── */
  if (recState === 'details') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="bg-surface border-b border-theme flex items-center gap-3 px-4 py-3 sticky top-0 z-10">
          <button onClick={() => setRecState('preview')} className="w-10 h-10 flex items-center justify-center text-theme-primary">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-bold text-theme-primary">Post Short</h1>
        </div>

        <div className="flex-1 overflow-y-auto pb-36">
          <div className="px-4 pt-5 space-y-5 max-w-2xl mx-auto">

            {/* Video thumbnail */}
            <div className="w-full aspect-[9/16] max-h-64 rounded-2xl overflow-hidden bg-black relative">
              {recordedUrl && (
                <video src={recordedUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <AlignLeft className="w-4 h-4 text-theme-muted mt-3 flex-shrink-0" />
                <textarea
                  value={description}
                  onChange={e => setDesc(e.target.value.slice(0, MAX_DESC))}
                  placeholder="Write a description for your short..."
                  rows={3}
                  className="flex-1 py-2.5 bg-transparent text-theme-primary placeholder:text-theme-muted outline-none text-sm resize-none leading-relaxed"
                />
              </div>
              <p className="text-right text-xs text-theme-muted">{description.length}/{MAX_DESC}</p>
            </div>

            {/* Hashtags */}
            <div className="border-b border-theme flex items-center gap-2">
              <Hash className="w-4 h-4 text-theme-muted flex-shrink-0" />
              <input
                value={hashtags}
                onChange={e => setHashtags(e.target.value)}
                placeholder="#hashtags (e.g. #shorts #deals #fashion)"
                className="flex-1 py-3 bg-transparent text-theme-primary placeholder:text-theme-muted outline-none text-sm"
              />
            </div>

            {/* Tag products */}
            <div>
              <p className="text-xs text-theme-muted mb-2">{taggedProducts.length}/5 tagged products</p>
              {taggedProducts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {taggedProducts.map(id => {
                    const p = products.find(p => p.id === id);
                    if (!p) return null;
                    return (
                      <div key={id} className="flex items-center gap-2 bg-elevated border border-theme rounded-xl px-3 py-2">
                        <span className="text-xs font-medium text-theme-primary truncate max-w-[120px]">{p.title}</span>
                        <button onClick={() => setTaggedProducts(prev => prev.filter(i => i !== id))}>
                          <X className="w-3.5 h-3.5 text-theme-muted hover:text-primary" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {taggedProducts.length < 5 && (
                <button
                  onClick={() => setShowProductPicker(true)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 border border-theme rounded-xl hover:bg-elevated transition-colors"
                >
                  <Plus className="w-5 h-5 text-theme-primary" />
                  <span className="flex-1 text-sm font-semibold text-theme-primary text-left">Tag products in your short</span>
                  <ChevronRight className="w-5 h-5 text-theme-muted" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-theme px-4 pt-4 pb-8 shadow-lg">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => router.push('/sell')}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary-hover transition-colors"
            >
              Post Short
            </button>
          </div>
        </div>

        {/* Product Picker Sheet */}
        {showProductPicker && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-surface rounded-t-3xl w-full max-w-lg flex flex-col" style={{ maxHeight: '85dvh' }}>
              <div className="p-4 flex-shrink-0 border-b border-theme">
                <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-theme-primary">Tag Products</h3>
                  <button onClick={() => { setShowProductPicker(false); setProductQuery(''); }}>
                    <X className="w-5 h-5 text-theme-muted" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
                  <input
                    autoFocus
                    type="text"
                    value={productQuery}
                    onChange={e => setProductQuery(e.target.value)}
                    placeholder="Search your products..."
                    className="w-full bg-elevated border border-theme rounded-xl py-2.5 pl-9 pr-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-2">
                {products
                  .filter(p => p.title.toLowerCase().includes(productQuery.toLowerCase()))
                  .map(p => {
                    const selected = taggedProducts.includes(p.id);
                    const maxed = !selected && taggedProducts.length >= 5;
                    return (
                      <button
                        key={p.id}
                        disabled={maxed}
                        onClick={() => {
                          setTaggedProducts(prev =>
                            selected ? prev.filter(i => i !== p.id) : [...prev, p.id]
                          );
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${selected ? 'bg-primary/10' : maxed ? 'opacity-40' : 'hover:bg-elevated'}`}
                      >
                        <div className="w-12 h-12 rounded-xl bg-elevated overflow-hidden flex-shrink-0">
                          <img src={`https://picsum.photos/seed/${p.id}/80/80`} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="text-sm font-semibold text-theme-primary truncate">{p.title}</p>
                          <p className="text-xs text-primary font-medium">{p.price}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${selected ? 'bg-primary' : 'border-2 border-theme'}`}>
                          {selected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
              <div className="p-4 border-t border-theme flex-shrink-0">
                <button
                  onClick={() => { setShowProductPicker(false); setProductQuery(''); }}
                  className="w-full py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-colors"
                >
                  Done ({taggedProducts.length}/5 selected)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── CAMERA / PREVIEW SCREEN ── */
  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-3 pb-2">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div className="px-3 py-1.5 rounded-full bg-black/50">
          <span className="text-white text-xs font-semibold">{fmt(timer)} / {fmt(maxDur)}</span>
        </div>
        {recState !== 'preview' ? (
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
            <X className="w-5 h-5 text-white" />
          </button>
        ) : <div className="w-10 h-10" />}
      </div>

      {/* Camera / Preview */}
      {recState !== 'preview' ? (
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <video ref={previewRef} src={recordedUrl || ''} autoPlay loop playsInline
          className="absolute inset-0 w-full h-full object-cover" />
      )}

      {/* Error */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10 p-6">
          <div className="text-center">
            <Camera className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white text-lg font-semibold mb-2">Camera Required</p>
            <p className="text-white/60 text-sm mb-5">{error}</p>
            <button onClick={() => startCamera()} className="px-6 py-2.5 bg-primary rounded-full text-white font-semibold">Try Again</button>
          </div>
        </div>
      )}

      {/* Right-side controls (idle / recording) */}
      {recState !== 'preview' && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-5">
          <button onClick={flipCamera} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-[10px]">Flip</span>
          </button>
          <input ref={uploadRef} type="file" accept="video/*" className="hidden" onChange={handleUpload} />
          <button onClick={() => uploadRef.current?.click()} className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <span className="text-white text-[10px]">Upload</span>
          </button>
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 bg-gradient-to-t from-black/70 to-transparent pt-8">

        {/* Duration selector — idle only */}
        {recState === 'idle' && (
          <div className="flex justify-center gap-2 mb-5">
            {DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setMaxDur(d)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  maxDur === d ? 'bg-primary text-white' : 'bg-white/20 text-white'
                }`}
              >
                {d}s
              </button>
            ))}
          </div>
        )}

        {/* Speed selector — idle only */}
        {recState === 'idle' && (
          <div className="flex justify-center gap-3 mb-5">
            {SPEEDS.map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`w-10 h-10 rounded-full text-xs font-bold transition-colors ${
                  speed === s ? 'bg-primary text-white' : 'bg-white/20 text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}

        {/* Record / Stop / Preview buttons */}
        {recState === 'idle' && (
          <div className="flex items-center justify-center">
            <button
              onClick={startRecording}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-lg"
              style={{ background: 'var(--primary)' }}
            >
              <Video className="w-8 h-8 text-white" />
            </button>
          </div>
        )}

        {recState === 'recording' && (
          <div className="flex items-center justify-center">
            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full border-4 border-white bg-primary flex items-center justify-center shadow-lg"
            >
              <Square className="w-8 h-8 text-white" fill="white" />
            </button>
          </div>
        )}

        {recState === 'preview' && (
          <div className="flex items-center justify-center gap-4 px-6">
            <button
              onClick={retake}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/20 rounded-full text-white font-semibold text-sm"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
            <button
              onClick={() => setRecState('details')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary rounded-full text-white font-semibold text-sm"
            >
              <Check className="w-4 h-4" /> Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
