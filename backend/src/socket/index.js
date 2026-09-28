import { Server } from 'socket.io';
import { registerJoinHandlers } from './handlers/join.js';
import { registerMessageHandlers } from './handlers/message.js';
import { registerTypingHandlers } from './handlers/typing.js';
import { registerDisconnectHandlers } from './handlers/disconnect.js';

export function createSocketServer(httpServer, corsOrigin) {
  const io = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`[connect] socket.id=${socket.id}`);

    registerJoinHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerTypingHandlers(io, socket);
    registerDisconnectHandlers(io, socket);
  });

  return io;
}