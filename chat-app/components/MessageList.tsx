'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/hooks/useChat';

interface MessageListProps {
  messages: Message[];
  currentUser: string | null;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll automático al final cuando llega un mensaje nuevo
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
      {messages.map((msg, i) => {
        if (msg.username === 'system') {
          return (
            <div key={i} className="text-center">
              <span className="text-xs text-gray-400 italic bg-gray-100 px-3 py-1 rounded-full">
                {msg.text}
              </span>
            </div>
          );
        }

        const isOwn = msg.username === currentUser;

        return (
          <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow-sm ${
                isOwn
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
              }`}
            >
              {!isOwn && (
                <p className="text-xs font-semibold text-blue-600 mb-0.5">
                  {msg.username}
                </p>
              )}
              <p className="break-words">{msg.text}</p>
              <p
                className={`text-[10px] mt-1 text-right ${
                  isOwn ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}