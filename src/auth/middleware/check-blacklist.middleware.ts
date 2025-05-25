import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CheckBlacklistMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
    if (!token) {
      return next(); // Không có token thì bỏ qua, để guard xử lý
    }
    const blacklisted = await this.prisma.blackList_access_token.findUnique({
      where: { accessToken: token },
    });
    if (blacklisted) {
      // Token nằm trong blacklist
      throw new UnauthorizedException('Token is blacklisted');
    }
    next();
  }
}
