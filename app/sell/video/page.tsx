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
  Scissors,
  Music,
  Type,
  Gauge,
  FileText,
} from 'lucide-react';
import { products } from '../../lib/data';

type RecordState = 'idle' | 'recording' | 'preview' | 'editor' | 'details';
type Speed = 0.5 | 1 | 2 | 3;
const MAX_DESC = 512;
const DURATIONS = [15, 30, 60] as const;
const SPEEDS: Speed[] = [0.5, 1, 2, 3];

/* ── Reel editor: sounds, overlays, drafts ───────────────────────── */
type Sound = { title: string; artist: string; duration: string };
type TextOverlay = { id: string; text: string; color: string; x: number; y: number };
type Draft = { id: string; description: string; hashtags: string; sound: Sound | null; savedAt: string };

const SOUNDS: Sound[] = [
  { title: 'I Know Who I Be', artist: 'Davido, JAZZWRLD, GL_Ceejay', duration: '0:28' },
  { title: 'Calm Down (Remix)', artist: 'LOVIXX, STOSLIV', duration: '2:21' },
  { title: 'Silent Discipline', artist: 'Green Mic', duration: '4:26' },
  { title: 'God Is Still Writing My Story', artist: 'Ellev8', duration: '4:13' },
  { title: 'Gifts to your future self', artist: 'adam.dodson', duration: '0:39' },
  { title: 'Sunset Drive', artist: 'Nairobi Nights', duration: '0:45' },
  { title: 'Amapiano Groove', artist: 'DJ Kasi', duration: '1:02' },
];

const OVERLAY_COLORS = ['#FFFFFF', '#C1121F', '#F5A623', '#2ECC71', '#4DA3FF', '#111111'];

const DRAFTS_KEY = 'aos-reel-drafts';

function loadDrafts(): Draft[] {
  try {
    return JSON.parse(window.localStorage.getItem(DRAFTS_KEY) || '[]') as Draft[];
  } catch {
    return [];
  }
}

function saveDrafts(drafts: Draft[]) {
  try {
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch { /* storage unavailable */ }
}

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

  /* ── editor state ── */
  const [overlays, setOverlays]         = useState<TextOverlay[]>([]);
  const [editingText, setEditingText]   = useState<TextOverlay | null>(null);
  const [sound, setSound]               = useState<Sound | null>(null);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [soundQuery, setSoundQuery]     = useState('');
  const [showSpeedSheet, setShowSpeedSheet] = useState(false);
  const [showTrimSheet, setShowTrimSheet]   = useState(false);
  const [trim, setTrim]                 = useState<[number, number]>([0, 100]);
  const [drafts, setDrafts]             = useState<Draft[]>([]);
  const [showDrafts, setShowDrafts]     = useState(false);

  useEffect(() => { setDrafts(loadDrafts()); }, []);

  const saveAsDraft = () => {
    const draft: Draft = {
      id: String(Date.now()),
      description,
      hashtags,
      sound,
      savedAt: new Date().toLocaleDateString([], { month: 'short', day: 'numeric' }),
    };
    const next = [draft, ...drafts];
    setDrafts(next);
    saveDrafts(next);
    router.push('/sell');
  };

  const restoreDraft = (d: Draft) => {
    setDesc(d.description);
    setHashtags(d.hashtags);
    setSound(d.sound);
    setShowDrafts(false);
  };

  const deleteDraft = (id: string) => {
    const next = drafts.filter(d => d.id !== id);
    setDrafts(next);
    saveDrafts(next);
  };

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

  /* ── EDITOR SCREEN ── */
  if (recState === 'editor') {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0F1115] flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between px-4 pt-3 pb-2 z-20">
          <button onClick={() => setRecState('preview')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          {sound ? (
            <button
              onClick={() => setShowSoundPicker(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 max-w-[60%]"
            >
              <Music className="w-3.5 h-3.5 text-white flex-shrink-0" />
              <span className="text-white text-xs font-medium truncate">{sound.title} · {sound.artist}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowSoundPicker(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10"
            >
              <Music className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-medium">Add sound</span>
            </button>
          )}
          <button
            onClick={() => setRecState('details')}
            className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Next
          </button>
        </div>

        {/* Preview with overlays */}
        <div className="relative flex-1 w-full max-w-md overflow-hidden rounded-2xl my-2">
          {recordedUrl && (
            <video src={recordedUrl} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
          )}
          {overlays.map(o => (
            <button
              key={o.id}
              onClick={() => setEditingText(o)}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-xl font-bold drop-shadow-lg px-2"
              style={{ left: `${o.x}%`, top: `${o.y}%`, color: o.color }}
            >
              {o.text}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="w-full bg-[#0F1115] py-3 flex justify-center gap-2 overflow-x-auto hide-scrollbar px-3">
          {[
            { icon: Scissors, label: 'Edit', onClick: () => setShowTrimSheet(true) },
            { icon: Music, label: 'Audio', onClick: () => setShowSoundPicker(true) },
            { icon: Type, label: 'Text', onClick: () => setEditingText({ id: String(Date.now()), text: '', color: '#FFFFFF', x: 50, y: 45 }) },
            { icon: Gauge, label: 'Speed', onClick: () => setShowSpeedSheet(true) },
          ].map(({ icon: Icon, label, onClick }) => (
            <button key={label} onClick={onClick} className="flex flex-col items-center gap-1.5 w-[68px] flex-shrink-0">
              <div className="w-[46px] h-[46px] rounded-xl bg-white/10 flex items-center justify-center">
                <Icon className="w-[22px] h-[22px] text-white" />
              </div>
              <span className="text-white/70 text-[11px]">{label}</span>
            </button>
          ))}
        </div>

        {/* Text editor sheet */}
        {editingText && (
          <div className="absolute inset-0 z-30 bg-black/70 flex flex-col items-center justify-center px-6">
            <input
              autoFocus
              value={editingText.text}
              onChange={e => setEditingText({ ...editingText, text: e.target.value })}
              placeholder="Type something…"
              className="w-full max-w-sm bg-transparent text-center text-2xl font-bold outline-none placeholder:text-white/40"
              style={{ color: editingText.color }}
            />
            <div className="flex gap-3 mt-6">
              {OVERLAY_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setEditingText({ ...editingText, color: c })}
                  className={`w-8 h-8 rounded-full border-2 ${editingText.color === c ? 'border-primary scale-110' : 'border-white/40'}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Text color ${c}`}
                />
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setOverlays(prev => prev.filter(o => o.id !== editingText.id));
                  setEditingText(null);
                }}
                className="px-5 py-2.5 rounded-full bg-white/15 text-white text-sm font-semibold"
              >
                {overlays.some(o => o.id === editingText.id) ? 'Remove' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  if (editingText.text.trim()) {
                    setOverlays(prev => {
                      const exists = prev.some(o => o.id === editingText.id);
                      return exists
                        ? prev.map(o => (o.id === editingText.id ? editingText : o))
                        : [...prev, editingText];
                    });
                  }
                  setEditingText(null);
                }}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Sound picker sheet */}
        {showSoundPicker && (
          <div className="absolute inset-0 z-30 flex items-end bg-black/60">
            <div className="w-full bg-[#16181D] rounded-t-3xl max-h-[70%] flex flex-col">
              <div className="p-4 border-b border-white/10 flex-shrink-0">
                <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">Add sound</h3>
                  <button onClick={() => setShowSoundPicker(false)} aria-label="Close">
                    <X className="w-5 h-5 text-white/60" />
                  </button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    value={soundQuery}
                    onChange={e => setSoundQuery(e.target.value)}
                    placeholder="Search sounds…"
                    className="w-full bg-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/40 outline-none"
                  />
                </div>
              </div>
              <div className="overflow-y-auto flex-1 p-2">
                {SOUNDS.filter(s =>
                  (s.title + s.artist).toLowerCase().includes(soundQuery.toLowerCase()),
                ).map(s => {
                  const selected = sound?.title === s.title;
                  return (
                    <button
                      key={s.title}
                      onClick={() => { setSound(selected ? null : s); setShowSoundPicker(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${selected ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Music className="w-5 h-5 text-white/70" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{s.title}</p>
                        <p className="text-xs text-white/50 truncate">{s.artist} · {s.duration}</p>
                      </div>
                      {selected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Speed sheet */}
        {showSpeedSheet && (
          <div className="absolute inset-0 z-30 flex items-end bg-black/60" onClick={() => setShowSpeedSheet(false)}>
            <div className="w-full bg-[#16181D] rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-white mb-4">Playback speed</h3>
              <div className="flex justify-center gap-3 pb-4">
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => { setSpeed(s); setShowSpeedSheet(false); }}
                    className={`w-12 h-12 rounded-full text-sm font-bold transition-colors ${speed === s ? 'bg-primary text-white' : 'bg-white/10 text-white'}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trim sheet */}
        {showTrimSheet && (
          <div className="absolute inset-0 z-30 flex items-end bg-black/60" onClick={() => setShowTrimSheet(false)}>
            <div className="w-full bg-[#16181D] rounded-t-3xl p-5" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              <h3 className="font-bold text-white mb-1">Trim clip</h3>
              <p className="text-xs text-white/50 mb-5">Drag to choose the section of your clip to keep</p>
              <div className="space-y-4 pb-4">
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1.5">
                    <span>Start</span><span>{trim[0]}%</span>
                  </div>
                  <input
                    type="range" min={0} max={trim[1] - 5} value={trim[0]}
                    onChange={e => setTrim([Number(e.target.value), trim[1]])}
                    className="w-full accent-[#C1121F]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-white/60 mb-1.5">
                    <span>End</span><span>{trim[1]}%</span>
                  </div>
                  <input
                    type="range" min={trim[0] + 5} max={100} value={trim[1]}
                    onChange={e => setTrim([trim[0], Number(e.target.value)])}
                    className="w-full accent-[#C1121F]"
                  />
                </div>
                <button
                  onClick={() => setShowTrimSheet(false)}
                  className="w-full py-3 rounded-2xl bg-primary text-white font-semibold text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── DETAILS SCREEN ── */
  if (recState === 'details') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="bg-surface border-b border-theme flex items-center gap-3 px-4 py-3 sticky top-0 z-10">
          <button onClick={() => setRecState('editor')} className="w-10 h-10 flex items-center justify-center text-theme-primary">
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
          <div className="max-w-2xl mx-auto flex gap-3">
            <button
              onClick={saveAsDraft}
              className="flex-1 py-4 rounded-2xl bg-elevated border border-theme text-theme-primary font-bold text-base hover:bg-surface transition-colors"
            >
              Save draft
            </button>
            <button
              onClick={() => router.push('/sell')}
              className="flex-[2] py-4 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary-hover transition-colors"
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
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* 9:16 portrait container — matches shorts feed width */}
      <div className="relative h-full w-full" style={{ maxWidth: 'calc(100vh * 9 / 16)', maxHeight: '100vh' }}>

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
            {drafts.length > 0 && (
              <button onClick={() => setShowDrafts(true)} className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-full bg-black/50 flex items-center justify-center relative">
                  <FileText className="w-5 h-5 text-white" />
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center">
                    {drafts.length}
                  </span>
                </div>
                <span className="text-white text-[10px]">Drafts</span>
              </button>
            )}
          </div>
        )}

        {/* Drafts sheet */}
        {showDrafts && (
          <div className="absolute inset-0 z-30 flex items-end bg-black/60" onClick={() => setShowDrafts(false)}>
            <div className="w-full bg-[#16181D] rounded-t-3xl max-h-[70%] flex flex-col p-4" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-3" />
              <h3 className="font-bold text-white mb-3">Drafts</h3>
              <div className="overflow-y-auto flex-1 space-y-1">
                {drafts.map(d => (
                  <div key={d.id} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white/70" />
                    </div>
                    <button onClick={() => restoreDraft(d)} className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {d.description || 'Untitled draft'}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {d.savedAt}{d.sound ? ` · 🎵 ${d.sound.title}` : ''}{d.hashtags ? ` · ${d.hashtags}` : ''}
                      </p>
                    </button>
                    <button onClick={() => deleteDraft(d.id)} className="p-2" aria-label="Delete draft">
                      <X className="w-4 h-4 text-white/50" />
                    </button>
                  </div>
                ))}
                {drafts.length === 0 && (
                  <p className="text-sm text-white/50 text-center py-6">No drafts yet</p>
                )}
              </div>
            </div>
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
                onClick={() => setRecState('editor')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary rounded-full text-white font-semibold text-sm"
              >
                <Check className="w-4 h-4" /> Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
