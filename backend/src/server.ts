import dotenv from 'dotenv';
import app from './app';
import { initializeAppInsights, logTrace, logEvent } from './utils/appInsights';
import { swaggerUi, swaggerSpec } from './config/swagger';

dotenv.config();


initializeAppInsights();
logTrace('Server initialization started');

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
  logEvent('ServerStarted', { port: PORT.toString() });
  logTrace(`Server successfully started on port ${PORT}`);
});

 