import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { SseModule } from './sse/sse.module';
import { CheckBlacklistMiddleware } from './auth/middleware/check-blacklist.middleware';
import { ProductController } from './product/product.controller';
import { UserController } from './user/user.controller';
import { SseController } from './sse/sse.controller';
import { ImportModule } from './import/import.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    ProductModule,
    UserModule,
    SseModule,
    ImportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckBlacklistMiddleware)
      .forRoutes(ProductController, UserController, SseController, {
        path: 'auth/logout',
        method: RequestMethod.POST,
      });
  }
}
