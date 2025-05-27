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
import { ImportController } from './import/import.controller';
import { SaleController } from './sale/sale.controller';
import { ImportModule } from './import/import.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SaleModule } from './sale/sale.module';

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
    EventEmitterModule.forRoot(),
    SaleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckBlacklistMiddleware)
      .forRoutes(
        ProductController,
        UserController,
        SseController,
        ImportController,
        SaleController,
        {
          path: 'auth/logout',
          method: RequestMethod.POST,
        },
      );
  }
}
