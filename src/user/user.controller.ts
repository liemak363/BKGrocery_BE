import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  profile(@Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.userService.getUserProfile(req.user);
  }
}
