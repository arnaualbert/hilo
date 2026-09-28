# Hilo

A real-time chat built from scratch to learn WebSockets.

## How this project is being built

This is a personal learning project. I'm practicing how to code alongside an AI assistant (DeepSeek), using it as a pair programmer while I learn WebSockets, event-driven architecture, and Docker.

## Stack

- **Backend:** Node.js + Express + Socket.io
- **Frontend:** Next.js (App Router, TypeScript, Tailwind CSS)
- **Infrastructure:** Docker + Docker Compose (development and production)

## Project structure

- `backend/` — Socket.io server
- `chat-app/` — Next.js client
- `docker-compose.dev.yml` — development stack
- `docker-compose.prod.yml` — production stack

## Roadmap

- [ ] Phase 1: Minimal Socket.io backend
- [ ] Phase 2: Messages, rooms, users, and typing indicator
- [ ] Phase 3: Next.js frontend at `/chat`
- [ ] Phase 4: Docker development setup with hot reload
- [ ] Phase 5: Docker production setup with reverse proxy
- [ ] Phase 6: Persistence, scaling, and tests

## Learning goals

- WebSockets and persistent connections
- Event-driven architecture with Socket.io
- Real-time state synchronization between client and server
- Containerizing a full-stack app for development and production

## Status

Early development. Nothing is production-ready yet.

## License

TBD