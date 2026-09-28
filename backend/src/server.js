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