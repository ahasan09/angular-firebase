# Angular Firebase

Angular 5 application demonstrating real-time CRUD operations on Firebase Realtime Database using AngularFire2.

## Tech Stack
- Angular 5
- AngularFire2
- Firebase Realtime Database
- TypeScript

## Project Structure
```
angular-firebase/
├── src/
│   └── app/
│       ├── app.module.ts
│       └── environments/
│           └── environment.ts   # Firebase config (API keys)
├── .angular-cli.json
└── package.json
```

## Development
```bash
# Install dependencies
npm install

# Run development server
ng serve

# Build
ng build
```

## Key Notes
- Firebase credentials must be set in `src/environments/environment.ts` before running.
- Uses legacy `.angular-cli.json` (Angular 5 era).
- Real-time data sync via AngularFire2 observables.
