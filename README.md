# Angular Firebase Demo

An Angular 21 application integrated with Firebase Realtime Database using AngularFire. Demonstrates real-time data synchronization, user authentication, and CRUD operations.

## Features

- Real-time data read/write with Firebase Realtime Database
- User authentication with Firebase Auth
- AngularFire integration

## Tech Stack

- Angular 21 (CLI v21)
- TypeScript 5.7
- Firebase / AngularFire
- Jest (unit testing)

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- Angular CLI: `npm install -g @angular/cli`
- A [Firebase](https://console.firebase.google.com/) project with Realtime Database and Authentication enabled

## Getting Started

### 1. Install dependencies

```bash
git clone https://github.com/ahasan09/angular-firebase
cd angular-firebase
npm install
```

### 2. Configure Firebase

Copy `.env.example` to `.env` and fill in your Firebase project credentials. The app reads these from `src/environments/environment.ts`.

### 3. Run the app

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app reloads automatically on file changes.

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server on port 4200 |
| `npm run build` | Build to `dist/` |
| `npm test` | Run unit tests (Jest) |
| `npm run lint` | Run ESLint |

## CI

GitHub Actions runs lint, tests, and a production build on every push/PR to `main`.
