import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig, mongoConfig, jwtConfig, rabbitmqConfig } from './config/app.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, mongoConfig, jwtConfig, rabbitmqConfig],
      envFilePath: '.env',
    }),

    // MongoDB Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongooseModule');
        let uri = configService.get<string>('mongo.uri') || 'mongodb://localhost:27017/youapp';

        // In development, use in-memory MongoDB if real MongoDB is not available
        if (configService.get<string>('app.nodeEnv') === 'development') {
          try {
            const { MongoMemoryServer } = await import('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            logger.log(`Using in-memory MongoDB at: ${uri}`);
          } catch {
            logger.log(`Using MongoDB at: ${uri}`);
          }
        }

        return {
          uri,
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 5000,
        };
      },
    }),

    // Feature Modules
    AuthModule,
    ProfileModule,
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
