import morgan from 'morgan';
import env from './env.config';

const morganFormat = env.node.env === 'production' ? 'combined' : 'dev';

export const morganMiddleware = morgan(morganFormat, {
  skip: (req, res) => {
    if (env.node.env === 'test') return true;
    if (req.url === '/health' || req.url === '/api-docs') return true;
    return false;
  },
});

export const logger = {
  info: (message: string, meta?: any) => {
    if (env.node.env !== 'test') {
      console.log(`[INFO] ${message}`, meta || '');
    }
  },
  error: (message: string, error?: any) => {
    if (env.node.env !== 'test') {
      console.error(`[ERROR] ${message}`, error || '');
    }
  },
  warn: (message: string, meta?: any) => {
    if (env.node.env !== 'test') {
      console.warn(`[WARN] ${message}`, meta || '');
    }
  },
  debug: (message: string, meta?: any) => {
    if (env.node.env === 'development') {
      console.debug(`[DEBUG] ${message}`, meta || '');
    }
  },
};
