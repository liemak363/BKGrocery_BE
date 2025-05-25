import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  controllers: [SseController],
  providers: [SseService],
  imports: [JwtModule.register({}), EventEmitterModule.forRoot()],
})
export class SseModule {}
