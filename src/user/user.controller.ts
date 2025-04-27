import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserProfileDto } from './dto/user.dto';

@ApiTags('user')
@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiResponse({
    status: 200,
    description: 'Thông tin profile của user',
    type: UserProfileDto,
  })
  profile(@Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.userService.getUserProfile(req.user);
  }
}
