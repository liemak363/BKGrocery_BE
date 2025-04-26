import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
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
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
