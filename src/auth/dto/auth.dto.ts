import { IsNotEmpty, IsString } from 'class-validator';
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
