import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { JwtLogoutStrategy } from './strategy/jwt-logout.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtLogoutStrategy],
  imports: [JwtModule.register({})],
})
export class AuthModule {}
