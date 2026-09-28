// hooks/useChat.ts
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, disconnectSocket } from '@/lib/socket';

// ---- Tipos ----
export interface Message {
  username: string;
  text: string;
  timestamp: string;
}

export interface TypingUser {
  username: string;
  isTyping: boolean;
}

export interface UseChatReturn {
  // Estado
  username: string | null;
  users: string[];
  messages: Message[];
  typingUsers: TypingUser[];
  isConnected: boolean;
  // Acciones
  join: (username: string) => void;
  sendMessage: (text: string) => void;
  emitTypingStart: () => void;
  emitTypingStop: () => void;
  leave: () => void;
}

export function useChat(): UseChatReturn {
  const [username, setUsername] = useState<string | null>(null);
  const [users, setUsers] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const joinedRef = useRef(false);           // evita doble join en StrictMode
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);          // estado local de typing (sin re-render)

  // ---- Conexión / cleanup ----
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    const handleUsersUpdate = ({ users: nextUsers }: { users: string[] }) => {
      setUsers(nextUsers);
    };

    const handleTypingUpdate = ({ username: u, isTyping }: TypingUser) => {
      setTypingUsers((prev) => {
        const filtered = prev.filter((t) => t.username !== u);
        return isTyping ? [...filtered, { username: u, isTyping: true }] : filtered;
      });
    };

    const handleSystem = ({ text }: { text: string }) => {
      setMessages((prev) => [
        ...prev,
        { username: 'system', text, timestamp: new Date().toISOString() },
      ]);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('message', handleMessage);
    socket.on('users:update', handleUsersUpdate);
    socket.on('typing:update', handleTypingUpdate);
    socket.on('system', handleSystem);

    // Cleanup: solo quitamos listeners, NO desconectamos el socket global
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('message', handleMessage);
      socket.off('users:update', handleUsersUpdate);
      socket.off('typing:update', handleTypingUpdate);
      socket.off('system', handleSystem);
    };
  }, []);

  // ---- Join ----
  const join = useCallback((name: string) => {
    const socket = socketRef.current;
    if (!socket || joinedRef.current) return;

    joinedRef.current = true;    // ← clave para StrictMode
    setUsername(name);
    socket.emit('join', { username: name, room: 'general' });
  }, []);

  // ---- Enviar mensaje ----
  const sendMessage = useCallback((text: string) => {
    const socket = socketRef.current;
    if (!socket || !text.trim()) return;
    socket.emit('message', { text: text.trim() });

    // Al enviar, dejamos de estar "escribiendo"
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('typing:stop');
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  // ---- Typing con debounce ----
  const emitTypingStart = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // Solo emitimos "start" la primera vez (sin re-render)
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socket.emit('typing:start');
    }

    // Reiniciamos el timer de stop
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socket.emit('typing:stop');
      }
    }, 1000);
  }, []);

  const emitTypingStop = useCallback(() => {
    const socket = socketRef.current;
    if (!socket) return;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('typing:stop');
    }
  }, []);

  // ---- Leave ----
  const leave = useCallback(() => {
    disconnectSocket();
    socketRef.current = null;
    joinedRef.current = false;
    setUsername(null);
    setUsers([]);
    setMessages([]);
    setTypingUsers([]);
    setIsConnected(false);
  }, []);

  // Limpiar timeout del typing al desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return {
    username,
    users,
    messages,
    typingUsers,
    isConnected,
    join,
    sendMessage,
    emitTypingStart,
    emitTypingStop,
    leave,
  };
}