import { IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
