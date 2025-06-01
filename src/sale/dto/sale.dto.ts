import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsInt,
  IsNotEmpty,
  Min,
  IsString,
} from 'class-validator';

export class SaleLogItemDto {
  @ApiProperty({
    description: 'tên sản phẩm đã bán',
    required: false,
    example: '1',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Tham chiếu đến bản ghi nhập hàng',
    required: false,
  })
  @IsInt()
  @IsOptional()
  saleLogId?: number;

  @ApiProperty({
    description: 'Tham chiếu đến sản phẩm đã bán',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Giá bán của sản phẩm',
    example: '5000',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Số lượng',
    example: '3',
  })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}

export class SaleLogDto {
  @ApiProperty({
    description: 'Total số tiền đã bán',
    required: false,
    example: '15000',
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  total?: number;

  @ApiProperty({
    description: 'Thời gian tạo bản ghi',
    example: '2025-05-27T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật bản ghi',
    required: false,
    example: '2025-05-27T00:00:00.000Z',
  })
  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @ApiProperty({
    description: 'Danh sách các sản phẩm đã bán',
    type: [SaleLogItemDto],
  })
  @IsNotEmpty()
  items: SaleLogItemDto[];
}

export class SaleLogQueryDto {
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

  @ApiProperty({
    description: 'id của bản ghi bán hàng',
    required: false,
    example: 1,
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  saleLogId?: number;
}
