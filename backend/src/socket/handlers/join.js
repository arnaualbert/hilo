import {
  addUser,
  getUsersByRoom,
  isUsernameTaken,
} from '../../state/users.js';
import { validateJoinPayload } from '../../utils/validation.js';

export function registerJoinHandlers(io, socket) {
  socket.on('join', (payload, ack) => {
    const v = validateJoinPayload(payload);
    if (!v.ok) {
      if (typeof ack === 'function') ack({ ok: false, error: v.error });
      return;
    }

    const { username, room } = v.data;

    if (isUsernameTaken(room, username)) {
      if (typeof ack === 'function') {
        ack({ ok: false, error: 'USERNAME_TAKEN_IN_ROOM' });
      }
      return;
    }

    addUser(socket.id, { username, room });
    socket.join(room);

    // Aviso de sistema a los demás (no al que entra)
    socket.to(room).emit('system:message', {
      type: 'join',
      text: `${username} entró al chat`,
      ts: Date.now(),
    });

    // Lista actualizada a TODO el room (incluido el que entra)
    io.to(room).emit('users:update', {
      room,
      users: getUsersByRoom(room),
    });

    if (typeof ack === 'function') {
      ack({ ok: true, room, users: getUsersByRoom(room) });
    }

    console.log(`[join] ${socket.id} -> ${username}@${room}`);
  });
}