import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from './product.service';
import { ProductDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('import')
  import(@Body() dto: ProductDto, @Req() req: Request) {
    console.log('Request Headers:', req.user);
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.productService.import(dto, req.user);
  }

  @Get('id/:id')
  getProductById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.productService.getProductById(id, req.user);
  }

  @Get('name/:name')
  getProductByName(@Param('name') name: string, @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.productService.getProductByName(name, req.user);
  }
}
