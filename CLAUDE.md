# Angular Firebase

Angular 21 application demonstrating real-time CRUD operations on Firebase Realtime Database using AngularFire.

## Tech Stack
- Angular 21
- AngularFire (v20) & Firebase SDK (v11)
- Firebase Realtime Database & Authentication
- Jest & ESLint
- TypeScript 5.9

## Project Structure
```
angular-firebase/
├── src/
│   └── app/
│       └── environments/
│           └── environment.ts   # Firebase config (API keys)
├── angular.json
├── package.json
└── tsconfig.json
```

## Development Commands
```bash
# Install dependencies
npm install

# Run development server
npm start   # or ng serve

# Build for production
npm run build   # or ng build

# Run unit tests
npm test

# Run linter
npm run lint
```

## Key Notes
- Firebase credentials must be set in `.env` (copied from `.env.example`). The app reads these into `src/environments/environment.ts` at build time.
- Uses Jest instead of Karma/Jasmine for unit testing.
- Uses standard modern `angular.json` configuration.
- Real-time data sync via AngularFire observables.
