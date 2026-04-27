'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  X,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  ShoppingBag,
  Camera,
  Mic,
  MicOff,
  Video,
  VideoOff,
  RotateCcw,
  Send,
  Gift,
  Users,
} from 'lucide-react';

type LiveState = 'setup' | 'live' | 'ended';

const MOCK_COMMENTS = [
  { user: 'Sarah M.', message: 'Love this! 💕', avatar: 'S' },
  { user: 'John K.', message: 'How much is shipping?', avatar: 'J' },
  { user: 'Emma W.', message: 'Can you show it closer?', avatar: 'E' },
  { user: 'Mike R.', message: '🔥🔥🔥', avatar: 'M' },
  { user: 'Lucy N.', message: 'Is this still available?', avatar: 'L' },
  { user: 'David O.', message: 'Great quality!', avatar: 'D' },
];

export default function GoLivePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<LiveState>('setup');
  const [viewers, setViewers] = useState(0);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<typeof MOCK_COMMENTS>([]);
  const [newComment, setNewComment] = useState('');
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setError(null);
    } catch (err) {
      setError('Camera access denied. Please allow camera permissions.');
      console.error(err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [facingMode]);

  // Simulate live stats
  useEffect(() => {
    if (state !== 'live') return;
    
    // Duration timer
    const durationInterval = setInterval(() => setDuration(d => d + 1), 1000);
    
    // Simulate viewers joining
    const viewerInterval = setInterval(() => {
      setViewers(v => Math.min(v + Math.floor(Math.random() * 5), 9999));
    }, 2000);

    // Simulate likes
    const likeInterval = setInterval(() => {
      setLikes(l => l + Math.floor(Math.random() * 3));
    }, 3000);

    // Simulate comments
    const commentInterval = setInterval(() => {
      const randomComment = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
      setComments(prev => [...prev.slice(-10), { ...randomComment, user: randomComment.user + Math.floor(Math.random() * 100) }]);
    }, 4000);

    return () => {
      clearInterval(durationInterval);
      clearInterval(viewerInterval);
      clearInterval(likeInterval);
      clearInterval(commentInterval);
    };
  }, [state]);

  const goLive = () => {
    if (!title.trim()) return;
    setViewers(Math.floor(Math.random() * 50) + 10);
    setLikes(0);
    setComments([]);
    setDuration(0);
    setState('live');
  };

  const endLive = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setState('ended');
  };

  const toggleMute = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = muted;
      setMuted(!muted);
    }
  };

  const toggleVideo = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = videoOff;
      setVideoOff(!videoOff);
    }
  };

  const flipCamera = () => {
    setFacingMode(f => (f === 'user' ? 'environment' : 'user'));
  };

  const sendComment = () => {
    if (!newComment.trim()) return;
    setComments(prev => [...prev, { user: 'You', message: newComment, avatar: 'Y' }]);
    setNewComment('');
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Setup Screen
  if (state === 'setup') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* Camera preview */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-12">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-white font-semibold">Go Live</h1>
            <button onClick={flipCamera} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6 z-20">
              <div className="text-center">
                <Camera className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold mb-2">Camera Required</p>
                <p className="text-white/60 text-sm mb-4">{error}</p>
                <button onClick={startCamera} className="px-6 py-2 bg-primary rounded-full text-white font-semibold">
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Setup Form */}
        <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-6 pb-10">
          <h2 className="text-lg font-bold text-theme-primary mb-4">Stream Details</h2>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Add a title for your live..."
            className="w-full bg-elevated border border-theme rounded-xl px-4 py-3 text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary mb-4"
          />
          <button
            onClick={goLive}
            disabled={!title.trim()}
            className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
          >
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
            Go Live
          </button>
        </div>
      </div>
    );
  }

  // Ended Screen
  if (state === 'ended') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6">
        <div className="bg-surface rounded-3xl p-8 text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <Video className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-theme-primary mb-2">Live Ended</h2>
          <p className="text-theme-secondary mb-6">Great stream! Here's your summary:</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-elevated rounded-xl p-3">
              <p className="text-2xl font-bold text-theme-primary">{fmt(duration)}</p>
              <p className="text-xs text-theme-muted">Duration</p>
            </div>
            <div className="bg-elevated rounded-xl p-3">
              <p className="text-2xl font-bold text-theme-primary">{viewers}</p>
              <p className="text-xs text-theme-muted">Viewers</p>
            </div>
            <div className="bg-elevated rounded-xl p-3">
              <p className="text-2xl font-bold text-theme-primary">{likes}</p>
              <p className="text-xs text-theme-muted">Likes</p>
            </div>
          </div>

          <button
            onClick={() => router.push('/sell')}
            className="w-full py-3 bg-primary text-white rounded-xl font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // Live Screen
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Camera */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${videoOff ? 'opacity-0' : ''}`}
        />
        {videoOff && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <VideoOff className="w-16 h-16 text-white/40" />
          </div>
        )}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-12">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-sm font-bold">LIVE</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-black/50 text-white text-sm font-medium">
              {fmt(duration)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50">
              <Eye className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">{viewers}</span>
            </div>
            <button onClick={endLive} className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Right side actions */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          <button onClick={flipCamera} className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-white" />
          </button>
          <button onClick={toggleMute} className={`w-12 h-12 rounded-full flex items-center justify-center ${muted ? 'bg-red-500' : 'bg-black/40'}`}>
            {muted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
          <button onClick={toggleVideo} className={`w-12 h-12 rounded-full flex items-center justify-center ${videoOff ? 'bg-red-500' : 'bg-black/40'}`}>
            {videoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
          </button>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-400" fill="#f87171" />
            </div>
            <span className="text-white text-xs mt-1">{likes}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="absolute bottom-32 left-0 right-16 px-4 max-h-48 overflow-hidden">
          <div className="flex flex-col gap-2">
            {comments.slice(-5).map((c, i) => (
              <div key={i} className="flex items-start gap-2 bg-black/40 rounded-xl px-3 py-2 backdrop-blur-sm">
                <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">{c.avatar}</span>
                </div>
                <div>
                  <span className="text-white/80 text-xs font-semibold">{c.user}</span>
                  <p className="text-white text-sm">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-8 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendComment()}
            placeholder="Say something..."
            className="flex-1 bg-white/20 rounded-full px-4 py-3 text-white placeholder:text-white/60 outline-none text-sm"
          />
          <button onClick={sendComment} className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <Send className="w-5 h-5 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
