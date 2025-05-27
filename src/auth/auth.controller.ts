import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, LogoutDto, NewAccessTokenDto } from './dto';
import { JwtLogoutGuard } from './guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

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

  @ApiBody({ type: LogoutDto, required: false })
  @ApiResponse({
    status: 201,
    description: 'Đăng xuất thành công',
    schema: {
      example: {
        message: 'Logout successful',
      },
    },
  })
  @UseGuards(JwtLogoutGuard)
  @ApiBearerAuth('access-token')
  @Post('logout')
  logout(
    @Body() dto: LogoutDto,
    @Req() req: Request & { user: { access_token: string; id: number } },
  ) {
    // Implement logout logic here
    return this.authService.logout(
      req.user.access_token,
      req.user.id,
      dto.refresh_token,
    );
  }

  @ApiBody({ type: NewAccessTokenDto })
  @ApiResponse({
    status: 201,
    description: 'Lấy access token mới thành công',
    schema: {
      example: {
        access_token: 'new.jwt.token.here',
      },
    },
  })
  @Post('newAccessToken')
  newAccessToken(@Body() dto: NewAccessTokenDto) {
    // Implement logic to get a new access token
    return this.authService.newAccessToken(dto.refresh_token);
  }
}
