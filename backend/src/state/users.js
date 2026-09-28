// Map principal: socketId -> { username, room }
const users = new Map();

export function addUser(socketId, { username, room }) {
  users.set(socketId, { username, room });
}

export function getUser(socketId) {
  return users.get(socketId) ?? null;
}

export function removeUser(socketId) {
  const user = users.get(socketId);
  users.delete(socketId);
  return user ?? null;
}

export function getUsersByRoom(room) {
  const result = [];
  for (const u of users.values()) {
    if (u.room === room) result.push(u.username);
  }
  return result;
}

export function isUsernameTaken(room, username) {
  const target = username.toLowerCase();
  for (const u of users.values()) {
    if (u.room === room && u.username.toLowerCase() === target) return true;
  }
  return false;
}

// Útil para debug / healthcheck
export function snapshot() {
  return Array.from(users.entries()).map(([id, u]) => ({ id, ...u }));
}