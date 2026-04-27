'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  Square,
  Play,
  RotateCcw,
  Check,
  Camera,
  Pause,
  X,
} from 'lucide-react';

type RecordingState = 'idle' | 'recording' | 'paused' | 'preview';

export default function ShortVideoPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<RecordingState>('idle');
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [error, setError] = useState<string | null>(null);

  const MAX_DURATION = 60;

  // Start camera stream
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
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, [facingMode]);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (state === 'recording') {
      interval = setInterval(() => {
        setTimer(t => {
          if (t >= MAX_DURATION - 1) {
            stopRecording();
            return MAX_DURATION;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state]);

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
    recorder.ondataavailable = e => e.data.size > 0 && chunksRef.current.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
      setState('preview');
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setTimer(0);
    setState('recording');
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(t => t.stop());
  };

  const retake = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedUrl(null);
    setTimer(0);
    setState('idle');
    startCamera();
  };

  const flipCamera = () => {
    setFacingMode(f => (f === 'user' ? 'environment' : 'user'));
  };

  const handleNext = () => {
    // In a real app, save the video blob and go to details form
    router.push('/sell/post?type=video');
  };

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-black/40 text-white text-sm font-semibold">
            {fmt(timer)} / {fmt(MAX_DURATION)}
          </div>
        </div>
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Camera / Preview */}
      <div className="flex-1 relative">
        {state !== 'preview' ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <video
            ref={previewRef}
            src={recordedUrl || ''}
            controls
            autoPlay
            loop
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Recording indicator */}
        {state === 'recording' && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-sm font-semibold">REC</span>
          </div>
        )}

        {/* Progress bar */}
        {state === 'recording' && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${(timer / MAX_DURATION) * 100}%` }}
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-6">
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

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-10 pt-6 bg-gradient-to-t from-black/80 to-transparent">
        {state === 'idle' && (
          <div className="flex items-center justify-center gap-8">
            <button onClick={flipCamera} className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={startRecording}
              className="w-20 h-20 rounded-full bg-red-500 border-4 border-white flex items-center justify-center shadow-lg"
            >
              <Video className="w-8 h-8 text-white" />
            </button>
            <div className="w-12 h-12" />
          </div>
        )}

        {state === 'recording' && (
          <div className="flex items-center justify-center">
            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-500 border-4 border-white flex items-center justify-center shadow-lg"
            >
              <Square className="w-8 h-8 text-white" fill="white" />
            </button>
          </div>
        )}

        {state === 'preview' && (
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={retake}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 rounded-full text-white font-semibold"
            >
              <RotateCcw className="w-5 h-5" /> Retake
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 bg-primary rounded-full text-white font-semibold"
            >
              <Check className="w-5 h-5" /> Use Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
