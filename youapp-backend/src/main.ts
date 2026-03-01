import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;
  const rabbitmqUrl = configService.get<string>('rabbitmq.url') || 'amqp://localhost:5672';

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe (DTO + class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors();

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('YouApp Backend API')
    .setDescription('API documentation for YouApp')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // RabbitMQ Connection for Consumers
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: 'messages_queue',
      queueOptions: {
        durable: false,
      },
      socketOptions: {
        timeout: 5000,
      },
    },
  });

  try {
    await app.startAllMicroservices();
    console.log('Microservices are listening (RabbitMQ Connected)');
  } catch (error) {
    console.warn('RabbitMQ is not available. Chat events will be skipped, but headers/profile will still work.');
  }

  await app.listen(port);
  console.log(`\n Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs available at: http://localhost:${port}/api/docs\n`);
}

bootstrap();
