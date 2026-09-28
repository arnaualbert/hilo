'use client';

import { useState, FormEvent } from 'react';

interface JoinFormProps {
  onJoin: (username: string) => void;
}

export default function JoinForm({ onJoin }: JoinFormProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) onJoin(trimmed);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Chat en tiempo real
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Sala: <span className="font-mono font-semibold">general</span>
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre de usuario"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          maxLength={20}
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}