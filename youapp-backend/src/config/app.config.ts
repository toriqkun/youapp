import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
}));

export const mongoConfig = registerAs('mongo', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/youapp',
}));

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'default-secret',
  expiration: process.env.JWT_EXPIRATION || '1d',
}));

export const rabbitmqConfig = registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
}));
