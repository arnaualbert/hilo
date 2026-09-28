export const LIMITS = {
  USERNAME_MAX: 20,
  ROOM_MAX: 30,
  MESSAGE_MAX: 500,
};

export function validateJoinPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'INVALID_PAYLOAD' };
  }

  const username =
    typeof payload.username === 'string' ? payload.username.trim() : '';
  const room = typeof payload.room === 'string' ? payload.room.trim() : '';

  if (!username) return { ok: false, error: 'USERNAME_REQUIRED' };
  if (username.length > LIMITS.USERNAME_MAX) {
    return { ok: false, error: 'USERNAME_TOO_LONG' };
  }
  if (!room) return { ok: false, error: 'ROOM_REQUIRED' };
  if (room.length > LIMITS.ROOM_MAX) {
    return { ok: false, error: 'ROOM_TOO_LONG' };
  }

  return { ok: true, data: { username, room } };
}

export function validateMessage(payload) {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, error: 'INVALID_PAYLOAD' };
  }

  const text = typeof payload.text === 'string' ? payload.text.trim() : '';

  if (!text) return { ok: false, error: 'EMPTY_MESSAGE' };
  if (text.length > LIMITS.MESSAGE_MAX) {
    return { ok: false, error: 'MESSAGE_TOO_LONG' };
  }

  return { ok: true, text };
}