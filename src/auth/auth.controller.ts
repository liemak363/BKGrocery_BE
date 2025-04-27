import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 201,
    description: 'Đăng nhập thành công',
    schema: {
      example: {
        access_token: 'jwt.token.here',
      },
    },
  })
  @Post('login')
  login(@Body() dto: AuthDto) {
    // Implement login logic here
    return this.authService.login(dto);
  }

  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 201,
    description: 'Đăng ký thành công',
    schema: {
      example: {
        access_token: 'jwt.token.here',
      },
    },
  })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // Implement signup logic here
    return this.authService.signup(dto);
  }
}
