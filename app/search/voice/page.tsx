'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Mic, MicOff, Search, X } from 'lucide-react';
import { products } from '../../lib/data';
import { ProductCard } from '../../components/product-card';

type ListenState = 'idle' | 'listening' | 'processing' | 'done' | 'error' | 'unsupported';

export default function VoiceSearchPage() {
  const router = useRouter();
  const [listenState, setListenState] = useState<ListenState>('idle');
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<any>(null);

  const results = transcript.length >= 2
    ? products.filter(p =>
        p.title.toLowerCase().includes(transcript.toLowerCase()) ||
        p.category.toLowerCase().includes(transcript.toLowerCase())
      )
    : [];

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      setListenState('unsupported');
      return;
    }

    setTranscript('');
    setErrorMsg('');
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => setListenState('listening');
    rec.onresult = (e: any) => {
      const text = Array.from(e.results as any[])
        .map((r: any) => r[0].transcript)
        .join('');
      setTranscript(text);
      if (e.results[e.results.length - 1].isFinal) {
        setListenState('processing');
      }
    };
    rec.onerror = (e: any) => {
      setErrorMsg(e.error === 'not-allowed' ? 'Microphone access denied.' : 'Something went wrong.');
      setListenState('error');
    };
    rec.onend = () => setListenState('done');

    recognitionRef.current = rec;
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListenState('done');
  };

  const reset = () => {
    recognitionRef.current?.stop();
    setTranscript('');
    setErrorMsg('');
    setListenState('idle');
  };

  useEffect(() => {
    startListening();
    return () => recognitionRef.current?.stop();
  }, []);

  const isListening = listenState === 'listening';

  return (
    <div className="min-h-screen bg-theme flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-theme bg-surface">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-elevated flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-theme-primary" />
        </button>
        <h1 className="flex-1 text-base font-semibold text-theme-primary">Voice Search</h1>
        {transcript && (
          <button onClick={reset} className="text-sm text-primary font-medium">
            Clear
          </button>
        )}
      </div>

      {/* Mic area */}
      <div className="flex flex-col items-center justify-center py-14 px-6">
        {/* Ripple rings */}
        <div className="relative flex items-center justify-center mb-8">
          {isListening && (
            <>
              <span className="absolute w-36 h-36 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '1.2s' }} />
              <span className="absolute w-28 h-28 rounded-full bg-primary/15 animate-ping" style={{ animationDuration: '1s' }} />
            </>
          )}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              isListening
                ? 'bg-primary scale-110 shadow-primary/40'
                : listenState === 'error'
                ? 'bg-red-500'
                : 'bg-elevated border-2 border-primary'
            }`}
          >
            {isListening
              ? <Mic className="w-8 h-8 text-white" />
              : listenState === 'error'
              ? <MicOff className="w-8 h-8 text-white" />
              : <Mic className="w-8 h-8 text-primary" />}
          </button>
        </div>

        {/* State label */}
        <p className={`text-sm font-medium mb-2 ${isListening ? 'text-primary' : 'text-theme-muted'}`}>
          {listenState === 'idle' && 'Tap the mic to start'}
          {listenState === 'listening' && 'Listening... tap to stop'}
          {listenState === 'processing' && 'Processing...'}
          {listenState === 'done' && (transcript ? 'Tap to search again' : 'Nothing heard — try again')}
          {listenState === 'error' && errorMsg}
          {listenState === 'unsupported' && 'Voice search not supported in this browser'}
        </p>

        {/* Transcript pill */}
        {transcript && (
          <div className="flex items-center gap-2 bg-surface border border-theme rounded-2xl px-4 py-2.5 max-w-sm w-full mt-2">
            <Search className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 text-sm font-medium text-theme-primary truncate">{transcript}</span>
            <button onClick={reset}>
              <X className="w-4 h-4 text-theme-muted" />
            </button>
          </div>
        )}

        {/* Waveform bars */}
        {isListening && (
          <div className="flex items-end justify-center gap-1 mt-6 h-10">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-primary rounded-full"
                style={{
                  animation: `voiceBar 0.8s ease-in-out ${(i * 0.05).toFixed(2)}s infinite alternate`,
                  height: `${Math.random() * 60 + 20}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes voiceBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>

      {/* Results */}
      {transcript.length >= 2 && (
        <div className="flex-1 px-4 pb-24">
          <p className="text-xs text-theme-muted mb-3">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{transcript}&rdquo;
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-theme-muted mx-auto mb-3 opacity-30" />
              <p className="text-sm text-theme-muted">No products matched. Try again.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {results.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
