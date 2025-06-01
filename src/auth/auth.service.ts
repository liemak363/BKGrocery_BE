import {
  ForbiddenException,
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    if (!dto.name || !dto.password) {
      throw new Error('Email and password are required');
    }

    // Hash the password
    const hashedPassword = await argon.hash(dto.password);

    // save user in db
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          password: hashedPassword,
        },
      });

      return this.signToken(user.id, user.name);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new NotAcceptableException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { name: dto.name },
    });

    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    // Return the user
    return this.signToken(user.id, user.name);
  }

  async logout(access_token: string, userId: number, refresh_token?: string) {
    // Parse refresh token to get userId if refresh_token exists
    console.log('Logout called with:', {
      refresh_token,
      access_token,
      userId,
    });

    if (refresh_token && refresh_token !== '') {
      try {
        const secretRefresh = this.config.get<string>('JWT_SECRET_REFRESH');
        const decoded = await this.jwt.verifyAsync<{
          sub: number;
          name: string;
        }>(refresh_token, {
          secret: secretRefresh,
        });

        // Verify that the refresh token belongs to the same user
        if (decoded.sub !== userId) {
          throw new ForbiddenException('Invalid refresh token');
        }

        // Add the refresh token to the blacklist
        await this.prisma.blackList_refresh_token.create({
          data: {
            refreshToken: refresh_token,
          },
        });
      } catch (error) {
        // If token is invalid or verification fails, we don't add it to blacklist
        if (error && typeof error === 'object' && 'message' in error) {
          console.error(
            'Invalid refresh token:',
            (error as { message: string }).message,
          );
        } else {
          console.error('Invalid refresh token:', error);
        }
      }
    }

    // Add the access token to the blacklist
    await this.prisma.blackList_access_token.create({
      data: {
        accessToken: access_token,
      },
    });

    return { message: 'Logout successful' };
  }

  async newAccessToken(refresh_token: string) {
    if (!refresh_token || refresh_token === '') {
      throw new BadRequestException('Refresh token is required');
    }

    const secretRefresh = this.config.get<string>('JWT_SECRET_REFRESH');
    let decoded: { exp?: number; sub: number; name: string };
    try {
      // Verify the refresh token
      decoded = await this.jwt.verifyAsync<{
        sub: number;
        name: string;
      }>(refresh_token, {
        secret: secretRefresh,
      });
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      throw new BadRequestException('Invalid refresh token');
    }

    // Check if the refresh token is blacklisted
    const isBlacklisted = await this.prisma.blackList_refresh_token.findUnique({
      where: { refreshToken: refresh_token },
    });

    if (isBlacklisted) {
      throw new ForbiddenException('Refresh token is blacklisted');
    }

    // check the exp of the refresh token, exp < 2 days -> return new refresh token
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const expTime = decoded.exp; // Expiration time from the decoded token
    if (expTime && expTime - currentTime < 2 * 24 * 60 * 60) {
      return this.signToken(decoded.sub, decoded.name);
    }

    return this.signNewAccessToken(decoded.sub, decoded.name);
  }

  async signToken(
    userId: number,
    name: string,
  ): Promise<{
    name: string;
    id: number;
    access_token: string;
    refresh_token: string;
  }> {
    const payload = {
      sub: userId,
      name,
    };
    const secret = this.config.get<string>('JWT_SECRET');

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '2h',
      secret: secret, // the secret key for signing the JWT, not protecting payload
    });

    const secretRefresh = this.config.get<string>('JWT_SECRET_REFRESH');
    const refresh_token = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: secretRefresh, // the secret key for signing the JWT, not protecting payload
    });

    return {
      name: payload.name,
      id: payload.sub,
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  async signNewAccessToken(userId: number, name: string) {
    const payload = {
      sub: userId,
      name,
    };
    const secret = this.config.get<string>('JWT_SECRET');
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '2h',
      secret: secret, // the secret key for signing the JWT, not protecting payload
    });

    return {
      access_token: access_token,
    };
  }
}
