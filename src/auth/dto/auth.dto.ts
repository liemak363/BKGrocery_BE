import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'test1', description: 'Tên đăng nhập' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123456', description: 'Mật khẩu' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LogoutDto {
  @ApiProperty({
    example: 'refresh_token',
    description: 'refresh token',
    required: false,
  })
  @IsOptional()
  @IsString()
  refresh_token: string;
}

export class NewAccessTokenDto {
  @ApiProperty({
    example: 'refresh_token',
    description: 'refresh token',
  })
  @IsString()
  refresh_token: string;
}
