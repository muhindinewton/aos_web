'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  RotateCcw,
  Send,
  ShoppingBag,
  Eye,
  Heart,
  X,
  Plus,
  ChevronRight,
  Hash,
  AlignLeft,
} from 'lucide-react';

type LiveState = 'setup' | 'live' | 'ended';
const MAX_DESC = 512;

const MOCK_COMMENTS = [
  { user: 'FashionLover', message: 'What size is that?', avatar: 'F' },
  { user: 'SneakerHead_KE', message: 'Price check?', avatar: 'S' },
  { user: 'NairobiStyle', message: 'Do you deliver to Mombasa?', avatar: 'N' },
  { user: 'Mike R.', message: '🔥🔥🔥', avatar: 'M' },
  { user: 'Lucy N.', message: 'Is this still available?', avatar: 'L' },
];

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<LiveState>('setup');
  const [title, setTitle]         = useState('');
  const [description, setDesc]    = useState('');
  const [hashtags, setHashtags]   = useState('');
  const [coverPreview, setCover]  = useState<string | null>(null);
  const [viewers, setViewers]     = useState(0);
  const [likes, setLikes]         = useState(0);
  const [comments, setComments]   = useState<typeof MOCK_COMMENTS>([]);
  const [newComment, setNewComment] = useState('');
  const [duration, setDuration]   = useState(0);
  const [muted, setMuted]         = useState(false);
  const [videoOff, setVideoOff]   = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [showEndDialog, setShowEndDialog] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (state === 'live') startCamera();
    return () => { if (state === 'live') streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, [state, facingMode]);

  useEffect(() => {
    if (state !== 'live') return;
    const d = setInterval(() => setDuration(v => v + 1), 1000);
    const v = setInterval(() => setViewers(v => Math.min(v + Math.floor(Math.random() * 5) + 1, 9999)), 2000);
    const l = setInterval(() => setLikes(v => v + Math.floor(Math.random() * 3)), 3000);
    const c = setInterval(() => {
      const r = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
      setComments(prev => [...prev.slice(-10), { ...r, user: r.user + Math.floor(Math.random() * 99) }]);
    }, 3500);
    return () => { clearInterval(d); clearInterval(v); clearInterval(l); clearInterval(c); };
  }, [state]);

  const goLive = () => {
    if (!title.trim()) return;
    setViewers(Math.floor(Math.random() * 50) + 10);
    setLikes(0); setComments([]); setDuration(0);
    setState('live');
  };

  const endLive = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setShowEndDialog(false);
    setState('ended');
  };

  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const handleCoverPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCover(URL.createObjectURL(file));
  };

  const sendComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { user: 'You', message: newComment, avatar: 'Y' }]);
    setNewComment('');
  };

  /* ── SETUP SCREEN ── */
  if (state === 'setup') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* App Bar */}
        <div className="bg-surface border-b border-theme flex items-center gap-3 px-4 py-3 sticky top-0 z-10">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center text-theme-primary">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-bold text-theme-primary">Go Live</h1>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-36">
          <div className="px-4 pt-5 space-y-5 max-w-2xl mx-auto">

            {/* Cover photo */}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPick} />
            <button
              onClick={() => coverInputRef.current?.click()}
              className="w-full h-52 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center overflow-hidden relative"
            >
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded bg-primary">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-[10px] font-bold tracking-wide">LIVE</span>
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-black/60 text-white text-xs font-medium">Change</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-theme-primary">Add Cover Photo</p>
                  <p className="text-xs text-theme-muted mt-1">This helps attract viewers</p>
                </>
              )}
            </button>

            {/* Title */}
            <div className="border-b border-theme">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Stream title (e.g., Flash Sale on Sneakers!)"
                className="w-full py-3 bg-transparent text-theme-primary font-semibold placeholder:text-theme-muted outline-none text-base"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <AlignLeft className="w-4 h-4 text-theme-muted mt-3 flex-shrink-0" />
                <textarea
                  value={description}
                  onChange={e => setDesc(e.target.value.slice(0, MAX_DESC))}
                  placeholder="Tell viewers what to expect in your live stream..."
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
                type="text"
                value={hashtags}
                onChange={e => setHashtags(e.target.value)}
                placeholder="#hashtags (e.g. #flashsale #live #deals)"
                className="flex-1 py-3 bg-transparent text-theme-primary placeholder:text-theme-muted outline-none text-sm"
              />
            </div>

            {/* Featured products */}
            <div>
              <p className="text-xs text-theme-muted mb-2">0/5 featured products</p>
              <button className="w-full flex items-center gap-3 px-4 py-3.5 border border-theme rounded-xl hover:bg-elevated transition-colors">
                <Plus className="w-5 h-5 text-theme-primary" />
                <span className="flex-1 text-sm font-semibold text-theme-primary text-left">Add featured products</span>
                <ChevronRight className="w-5 h-5 text-theme-muted" />
              </button>
            </div>
          </div>
        </div>

        {/* Sticky bottom button */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-theme px-4 pt-4 pb-8 shadow-lg">
          <div className="max-w-2xl mx-auto space-y-2">
            <button
              onClick={goLive}
              disabled={!title.trim()}
              className="w-full py-4 rounded-2xl bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-base flex items-center justify-center gap-2 transition-colors hover:bg-primary-hover"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
              Go Live Now
            </button>
            <p className="text-center text-xs text-theme-muted">Viewers will be notified when you go live</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── ENDED SCREEN ── */
  if (state === 'ended') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="bg-surface rounded-3xl p-8 text-center max-w-sm w-full border border-theme shadow-soft">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Video className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-theme-primary mb-2">Live Ended</h2>
          <p className="text-sm text-theme-muted mb-6">Great stream! Here's your summary:</p>
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[{ label: 'Duration', value: fmt(duration) }, { label: 'Viewers', value: String(viewers) }, { label: 'Likes', value: String(likes) }].map(s => (
              <div key={s.label} className="bg-elevated rounded-xl p-3">
                <p className="text-xl font-bold text-theme-primary">{s.value}</p>
                <p className="text-xs text-theme-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/sell')} className="w-full py-3.5 bg-primary text-white rounded-2xl font-semibold hover:bg-primary-hover transition-colors">
            Done
          </button>
        </div>
      </div>
    );
  }

  /* ── LIVE SCREEN ── */
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      <video
        ref={videoRef}
        autoPlay playsInline muted
        className={`absolute inset-0 w-full h-full object-cover ${videoOff ? 'opacity-0' : ''}`}
      />
      {videoOff && (
        <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
          <VideoOff className="w-16 h-16 text-white/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-2 px-3 pt-12 pb-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary">
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-white text-xs font-bold tracking-wide">LIVE</span>
        </div>
        <div className="px-3 py-1.5 rounded-md bg-black/60">
          <span className="text-white text-xs font-medium">{fmt(duration)}</span>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-black/60">
          <Eye className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-medium">{viewers}</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setShowEndDialog(true)}
          className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-semibold"
        >
          End
        </button>
      </div>

      {/* Right controls */}
      <div className="absolute right-3 z-10 flex flex-col items-center gap-4" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
          <RotateCcw className="w-5 h-5 text-white" />
        </button>
        <button onClick={() => { const t = streamRef.current?.getAudioTracks()[0]; if (t) { t.enabled = muted; setMuted(!muted); } }}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${muted ? 'bg-primary' : 'bg-black/50'}`}>
          {muted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
        </button>
        <button onClick={() => { const t = streamRef.current?.getVideoTracks()[0]; if (t) { t.enabled = videoOff; setVideoOff(!videoOff); } }}
          className={`w-12 h-12 rounded-full flex items-center justify-center ${videoOff ? 'bg-primary' : 'bg-black/50'}`}>
          {videoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
        </button>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-400" fill="#f87171" />
          </div>
          <span className="text-white text-xs font-medium">{likes}</span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="absolute bottom-28 left-0 right-16 px-3 flex flex-col gap-2 max-h-52 overflow-hidden">
        {comments.slice(-5).map((c, i) => (
          <div key={i} className="flex items-start gap-2 bg-black/50 rounded-2xl px-3 py-2 backdrop-blur-sm w-fit max-w-full">
            <div className="w-6 h-6 rounded-full bg-primary/80 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">{c.avatar}</span>
            </div>
            <div className="min-w-0">
              <span className="text-white/80 text-xs font-semibold">{c.user} </span>
              <span className="text-white text-xs">{c.message}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom input */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-8 pt-3">
        <div className="flex items-center gap-2">
          <input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendComment()}
            placeholder="Say something..."
            className="flex-1 bg-white/20 rounded-full px-4 py-3 text-white placeholder:text-white/50 outline-none text-sm"
          />
          <button onClick={sendComment} className="w-11 h-11 rounded-full bg-primary flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </button>
          <button className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* End stream dialog */}
      {showEndDialog && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-6">
          <div className="bg-surface rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-theme-primary mb-2">End Live Stream?</h3>
            <p className="text-sm text-theme-muted mb-6">Your live stream will end and viewers will be disconnected.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowEndDialog(false)} className="flex-1 py-3 rounded-2xl border border-theme text-theme-primary font-semibold text-sm">
                Continue Streaming
              </button>
              <button onClick={endLive} className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold text-sm">
                End Stream
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
