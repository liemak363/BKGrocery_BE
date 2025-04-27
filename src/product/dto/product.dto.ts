import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';

export class ProductDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0) // Allow zero or positive values
  quantity: number;

  @IsString()
  @IsOptional()
  description?: string;
}
