# Angular Firebase Demo

An Angular application integrated with Firebase Realtime Database using AngularFire2. Demonstrates real-time data synchronization between the browser and Firebase.

## Features

- Real-time data read/write with Firebase Realtime Database
- AngularFire2 integration

## Tech Stack

- Angular (CLI v1.6.4)
- TypeScript
- Firebase / AngularFire2

## Prerequisites

- [Node.js](https://nodejs.org/) v10+
- Angular CLI: `npm install -g @angular/cli`
- A [Firebase](https://console.firebase.google.com/) project with Realtime Database enabled

## Getting Started

### 1. Install dependencies

```bash
git clone https://github.com/ahasan09/angular-firebase
cd angular-firebase
npm install
```

### 2. Configure Firebase

Update `src/environments/environment.ts` with your Firebase project credentials:

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT.firebaseapp.com',
    databaseURL: 'https://YOUR_PROJECT.firebaseio.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID'
  }
};
```

### 3. Run the app

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200). The app reloads automatically on file changes.

## Commands

| Command | Description |
|---------|-------------|
| `ng serve` | Start dev server on port 4200 |
| `ng build` | Build to `dist/` |
| `ng build --prod` | Production build |
| `ng test` | Run unit tests (Karma) |
| `ng e2e` | Run end-to-end tests (Protractor) |
