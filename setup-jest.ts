// Polyfill fetch for Firebase SDK compatibility in jsdom test environment
import { fetch, Headers, Request, Response } from 'cross-fetch';
Object.assign(globalThis, { fetch, Headers, Request, Response });
