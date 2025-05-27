import {
  IsOptional,
  IsDate,
  IsNumber,
  IsInt,
  Min,
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ImportLogDto {
  @ApiProperty({
    description: 'Tên hàng',
    example: 'Táo đỏ',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Số lượng hàng nhập',
    required: false,
    default: 0,
    example: 1,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  quantity: number = 0;

  @ApiProperty({
    description: 'Giá nhập hàng',
    example: 100000,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Mô tả nhập hàng',
    required: false,
    example: 'Táo đỏ nhập khẩu từ Mỹ',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Thời gian tạo bản ghi',
    example: '2025-05-26T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật bản ghi',
    required: false,
    example: '2025-05-26T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({
    description: 'productId',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  productId: number;
}

export class ImportLogQueryDto {
  @ApiProperty({
    description: 'Thời gian bắt đầu lấy bản ghi (createdAt < lastTime)',
    required: false,
    example: '2025-05-26T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastTime?: Date;

  @ApiProperty({
    description: 'Số lượng bản ghi để bỏ qua',
    required: false,
    default: 0,
    example: 0,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  offset?: number = 0;

  @ApiProperty({
    description: 'Số lượng bản ghi tối đa để lấy',
    required: false,
    default: 10,
    example: 10,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;
}
