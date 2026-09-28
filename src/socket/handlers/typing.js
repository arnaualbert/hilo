import { getUser } from '../../state/users.js';

export function registerTypingHandlers(io, socket) {
  socket.on('typing:start', () => {
    const user = getUser(socket.id);
    if (!user) return;
    socket.to(user.room).emit('typing:start', { username: user.username });
  });

  socket.on('typing:stop', () => {
    const user = getUser(socket.id);
    if (!user) return;
    socket.to(user.room).emit('typing:stop', { username: user.username });
  });
}