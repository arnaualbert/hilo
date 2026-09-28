'use client';

import { useChat } from '@/hooks/useChat';
import JoinForm from '@/components/JoinForm';
import UserList from '@/components/UserList';
import MessageList from '@/components/MessageList';
import MessageInput from '@/components/MessageInput';

export default function ChatPage() {
  const {
    username,
    users,
    messages,
    typingUsers,
    isConnected,
    join,
    sendMessage,
    emitTypingStart,
    emitTypingStop,
  } = useChat();

  // Pantalla inicial: solo el formulario de entrada
  if (!username) {
    return <JoinForm onJoin={join} />;
  }

  // Texto de "X está escribiendo…"
  const typingText = typingUsers
    .filter((t) => t.username !== username)
    .map((t) => t.username)
    .join(', ');

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar de usuarios */}
      <UserList users={users} currentUser={username} />

      {/* Área principal del chat */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-gray-800"># general</h1>
            <p className="text-xs text-gray-400">
              {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
            </p>
          </div>
        </header>

        {/* Mensajes */}
        <MessageList messages={messages} currentUser={username} />

        {/* Indicador de typing */}
        <div className="h-5 px-4">
          {typingText && (
            <p className="text-xs text-gray-500 italic animate-pulse">
              {typingText} {typingUsers.length === 1 ? 'está' : 'están'} escribiendo…
            </p>
          )}
        </div>

        {/* Input */}
        <MessageInput
          onSend={sendMessage}
          onTypingStart={emitTypingStart}
          onTypingStop={emitTypingStop}
          disabled={!isConnected}
        />
      </main>
    </div>
  );
}