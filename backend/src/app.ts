import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import { corsMiddleware, errorHandler, notFoundHandler } from './middlewares';
import { morganMiddleware } from './config/logger.config';
import routes from './routes';

const app: Application = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
