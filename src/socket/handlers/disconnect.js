import { getUsersByRoom, removeUser } from '../../state/users.js';

export function registerDisconnectHandlers(io, socket) {
  socket.on('disconnect', (reason) => {
    const user = removeUser(socket.id);

    if (!user) {
      console.log(`[disconnect] ${socket.id} (nunca hizo join) reason=${reason}`);
      return;
    }

    const { username, room } = user;

    // Usamos io.to(room) porque tras disconnect el socket ya no está en rooms
    io.to(room).emit('system:message', {
      type: 'leave',
      text: `${username} salió del chat`,
      ts: Date.now(),
    });

    io.to(room).emit('users:update', {
      room,
      users: getUsersByRoom(room),
    });

    console.log(`[disconnect] ${username}@${room} reason=${reason}`);
  });
}