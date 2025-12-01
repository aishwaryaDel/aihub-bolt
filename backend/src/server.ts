import 'reflect-metadata';
import app from './app';
import { connectDatabase } from './config/database.config';
import env from './config/env.config';
import { logger } from './config/logger.config';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = app.listen(env.node.port, () => {
      logger.info(`✓ Server running on port ${env.node.port}`);
      logger.info(`✓ Environment: ${env.node.env}`);
      logger.info(`✓ Health check: http://localhost:${env.node.port}/health`);
    });

    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      server.close(async () => {
        logger.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
