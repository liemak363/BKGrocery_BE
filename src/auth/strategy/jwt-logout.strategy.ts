import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtLogoutStrategy extends PassportStrategy(
  Strategy,
  'jwt-logout',
) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    const jwtSecret = config.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      passReqToCallback: true, // Cho phép truyền req vào validate
    });
  }

  async validate(req: Request, payload: { sub: number; name: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new NotFoundException('Credentials incorrect');
    }
    // Lấy access token từ header
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
    return { id: user.id, access_token: token };
  }
}
