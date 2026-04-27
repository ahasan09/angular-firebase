# Improvement Plan: angular-firebase

## Overview
Angular 5 + AngularFire2 app for Firebase Realtime Database CRUD. Angular 5 is EOL, AngularFire2 is outdated (current is AngularFire v7+), and Firebase credentials may be committed to the repository.

## Improvements

### Security (High Priority)
- Audit `src/environments/environment.ts` — if Firebase API keys are committed, rotate them immediately
- Move Firebase config to environment variables or a `.env` file that is gitignored
- Add Firebase Security Rules to the Realtime Database to prevent unauthorized reads/writes

### Modernization (High Priority)
- Upgrade from Angular 5 to Angular 19+
- Upgrade from AngularFire2 to the latest AngularFire (modular Firebase SDK v11+)
- Replace `.angular-cli.json` with `angular.json`
- Consider migrating from Realtime Database to Firestore (more structured querying)

### Testing
- Add unit tests for Firebase service methods using AngularFire's emulator test helpers
- Add e2e tests with the Firebase Local Emulator Suite

### Code Quality
- Enable TypeScript `strict` mode
- Add proper TypeScript interfaces for all Firestore/RTDB document shapes
- Add ESLint + `@angular-eslint`

### Features
- Add user authentication (Firebase Auth) before allowing CRUD operations
- Add optimistic UI updates with error rollback
- Add offline persistence support

### DevOps
- Add GitHub Actions CI: lint + test + build
- Add Firebase Hosting deploy step to CI
