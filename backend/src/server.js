// import http from 'node:http';
// import express from 'express';
// import { Server } from 'socket.io';

// const PORT = 3001;
// const CLIENT_ORIGIN = 'http://localhost:3000';

// const app = express();

// // Servimos la carpeta public/ como estática (útil para el index.html de prueba)
// app.use(express.static('public'));

// // Creamos el server HTTP "a mano" para poder engancharlo con Socket.io
// const httpServer = http.createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     origin: CLIENT_ORIGIN,
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// io.on('connection', (socket) => {
//   console.log(`[connect] socket.id=${socket.id}`);

//   // Evento custom para verificar ida y vuelta
//   socket.on('ping:test', (payload, ack) => {
//     console.log(`[ping:test] de ${socket.id}:`, payload);

//     // Respondemos de dos formas: evento y ack (por si el cliente usa callback)
//     socket.emit('pong:test', { ok: true, from: socket.id, echo: payload });
//     if (typeof ack === 'function') ack({ ok: true, from: socket.id });
//   });

//   socket.on('disconnect', (reason) => {
//     console.log(`[disconnect] socket.id=${socket.id} reason=${reason}`);
//   });
// });

// httpServer.listen(PORT, () => {
//   console.log(`🚀 HTTP + Socket.io escuchando en http://localhost:${PORT}`);
//   console.log(`   CORS permitido para: ${CLIENT_ORIGIN}`);
// });

import http from 'node:http';
import express from 'express';
import { createSocketServer } from './socket/index.js';

const PORT = 3001;
const CLIENT_ORIGIN = 'http://localhost:3000';

const app = express();
app.use(express.static('public'));

const httpServer = http.createServer(app);
createSocketServer(httpServer, CLIENT_ORIGIN);

httpServer.listen(PORT, () => {
  console.log(`🚀 HTTP + Socket.io escuchando en http://localhost:${PORT}`);
  console.log(`   CORS permitido para: ${CLIENT_ORIGIN}`);
});