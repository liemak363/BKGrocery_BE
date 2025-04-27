import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: AuthDto) {
    // Implement login logic here
    return this.authService.login(dto);
  }

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // Implement signup logic here
    return this.authService.signup(dto);
  }
}
