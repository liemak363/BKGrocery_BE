import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { SseService } from './sse.service';
import { MessageEvent } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
// import { NotFoundException } from '@nestjs/common/exceptions';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('sse')
export class SseController {
  constructor(
    private readonly sseService: SseService,
    private prisma: PrismaService,
  ) {}

  // @Sse('events/:tempToken')
  // async sse(@Param('tempToken') tempToken: string) {
  //   // parse the tempToken to get the userId
  //   const userId = this.sseService.getUserIdFromTempToken(tempToken);
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return this.sseService.addClient(userId);
  // }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Sse('')
  sse(@Req() req: Request) {
    console.log('Request Headers sse:', req.user);
    return this.sseService.addClient(req.user as number);
  }

  @Get('testSse/:userId')
  testSse(@Param('userId', ParseIntPipe) userId: number) {
    this.sseService.testSse(userId);
  }

  // @UseGuards(JwtGuard)
  // @ApiBearerAuth('access-token')
  // @Get('tempToken')
  // getTempToken(@Req() req: Request): string {
  //   console.log('Request Headers:', req.user);
  //   if (!req.user || typeof req.user !== 'number') {
  //     throw new Error('Invalid user or user ID');
  //   }
  //   return this.sseService.getTempToken(req.user);
  // }
}
