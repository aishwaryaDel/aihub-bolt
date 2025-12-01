import { Sequelize } from 'sequelize-typescript';
import env from './env.config';
import path from 'path';

const sequelize = new Sequelize({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  username: env.database.user,
  password: env.database.password,
  dialect: 'postgres',
  logging: env.node.env === 'development' ? console.log : false,
  dialectOptions: {
    ssl: env.database.ssl
      ? {
          require: true,
          rejectUnauthorized: false,
        }
      : false,
  },
  models: [path.join(__dirname, '../models')],
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    if (env.node.env === 'development') {
      await sequelize.sync({ alter: false });
      console.log('✓ Database models synchronized');
    }
  } catch (error) {
    console.error('✗ Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;
