import { Global, Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  controllers: [SseController],
  providers: [SseService],
  imports: [JwtModule.register({})],
  exports: [SseService],
})
export class SseModule {}
