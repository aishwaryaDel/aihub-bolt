import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import useCaseRoutes from './routes/useCaseRoutes';
import userRoutes from './routes/userRoutes';
import authRoutes from './auth';
import { initializeAppInsights } from './utils/appInsights';

// Environment Variablen laden (.env)
dotenv.config();

// Initialize Application Insights
initializeAppInsights();

// Express App initialisieren
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basis-Routen
app.use('/api/use-cases', useCaseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('Tesa AI Hub Backend is running 🚀');
});

// Serverstart
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
