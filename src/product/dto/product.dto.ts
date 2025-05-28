import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  IsOptional,
  IsDate,
  IsInt,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductDto {
  @ApiProperty({ example: 1, description: 'ID sản phẩm' })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'Táo đỏ Mỹ', description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 100000,
    description: 'Giá sản phẩm (phải lớn hơn 0)',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 10, description: 'Số lượng sản phẩm (>= 0)' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0) // Allow zero or positive values
  quantity: number;

  @ApiProperty({
    example: 'Táo đỏ nhập khẩu từ Mỹ',
    description: 'Mô tả sản phẩm',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class ProductQueryDto {
  @ApiProperty({
    example: '2025-04-27T12:00:00.000Z',
    description: 'Thời gian đồng bộ cuối cùng (ISO 8601 format)',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastTimeSync?: Date;

  @ApiProperty({
    example: 1,
    description: 'id sản phẩm',
    required: false,
  })
  @IsInt()
  @IsOptional()
  id?: number;

  @ApiProperty({
    example: 'Táo đỏ Mỹ',
    description: 'Tên sản phẩm',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
