import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
 
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AIHub Bolt API',
      version: '1.0.0',
      description: 'API documentation for AIHub Bolt backend',
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts','./src/auth.ts'], // adjust paths as needed
};
 
const swaggerSpec = swaggerJsdoc(options);
 
export { swaggerUi, swaggerSpec };