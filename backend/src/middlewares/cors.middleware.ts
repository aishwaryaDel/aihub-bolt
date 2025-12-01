import cors from 'cors';
import env from '../config/env.config';

export const corsMiddleware = cors({
  origin: env.cors.origin,
  credentials: env.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400,
});
