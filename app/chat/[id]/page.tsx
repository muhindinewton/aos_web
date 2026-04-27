'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Send, Phone, MoreVertical } from 'lucide-react';
import { chats } from '../../lib/data';

export default function ChatDetailPage() {
  const params = useParams();
  const chat = chats.find(c => c.id === params.id) || chats[0];
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(chat.messages);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: String(prev.length + 1),
      sender: 'user',
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setNewMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100dvh-144px)] md:h-[calc(100dvh-140px)]">
      {/* Chat Header */}
      <div className="bg-surface border-b border-theme px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <Link href="/contact" className="md:hidden w-8 h-8 rounded-full bg-elevated flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-theme-primary" />
        </Link>
        <Link href="/contact" className="hidden md:inline-flex items-center gap-1 text-sm text-theme-muted hover:text-primary mr-2">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-bold text-primary">{chat.avatar}</span>
          </div>
          {chat.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm text-theme-primary truncate">{chat.name}</h2>
          <p className="text-[11px] text-theme-muted">{chat.online ? 'Online' : 'Last seen recently'}</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-elevated flex items-center justify-center transition-colors">
            <Phone className="w-4 h-4 text-theme-muted" />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-elevated flex items-center justify-center transition-colors">
            <MoreVertical className="w-4 h-4 text-theme-muted" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
              msg.sender === 'user'
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-elevated text-theme-primary rounded-bl-md'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/60' : 'text-theme-muted'}`}>{msg.timestamp}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="bg-surface border-t border-theme px-4 py-3 flex items-center gap-2 flex-shrink-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-elevated border border-theme rounded-full py-2.5 px-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
