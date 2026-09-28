import { getUser } from '../../state/users.js';
import { validateMessage } from '../../utils/validation.js';

export function registerMessageHandlers(io, socket) {
  socket.on('message', (payload, ack) => {
    const user = getUser(socket.id);
    if (!user) {
      if (typeof ack === 'function') ack({ ok: false, error: 'NOT_JOINED' });
      return;
    }

    const v = validateMessage(payload);
    if (!v.ok) {
      if (typeof ack === 'function') ack({ ok: false, error: v.error });
      return;
    }

    const msg = {
      id: `${socket.id}:${Date.now()}`,
      from: socket.id,
      username: user.username,
      room: user.room,
      text: v.text,
      ts: Date.now(),
    };

    // Broadcast SOLO al room del emisor (incluye al emisor)
    io.to(user.room).emit('message', msg);

    if (typeof ack === 'function') ack({ ok: true, id: msg.id });

    console.log(`[message] ${user.username}@${user.room}: ${v.text}`);
  });
}