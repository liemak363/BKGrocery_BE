// src/user/dto/user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProductProfileDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2025-04-27T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-04-27T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 'Táo đỏ Mỹ' })
  name: string;

  @ApiProperty({ example: 100000 })
  price: number;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 'Táo đỏ nhập khẩu từ Mỹ', required: false })
  description?: string;
}

export class UserProfileDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'john_doe' })
  name: string;

  @ApiProperty({ example: '2025-04-27T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-04-27T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ type: [ProductProfileDto] })
  products: ProductProfileDto[];
}
