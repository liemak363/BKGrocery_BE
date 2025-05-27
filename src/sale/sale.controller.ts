import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SaleLogDto, SaleLogQueryDto } from './dto/sale.dto';

@ApiTags('sale')
@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@Controller('sale')
export class SaleController {
  constructor(private saleService: SaleService) {}

  @Post()
  @ApiBody({ type: SaleLogDto, isArray: true })
  @ApiResponse({
    status: 201,
    description: 'Tạo mới hoặc cập nhật log bán hàng thành công',
    schema: {
      example: {
        message: 'Sale created successfully',
        productsUpdated: 1,
      },
    },
  })
  createSale(@Req() req: Request, @Body() dto: SaleLogDto[]) {
    if (!req.user || typeof req.user !== 'number') {
      throw new BadRequestException('Invalid user or user ID');
    }
    return this.saleService.createSale(req.user, dto);
  }

  @Get('log')
  getSaleLog(@Query() query: SaleLogQueryDto, @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new BadRequestException('Invalid user or user ID');
    }
    return this.saleService.getSaleLog(req.user, query);
  }

  @Get('log/:id')
  getSaleLogItems(
    @Query('id', ParseIntPipe) saleLogId: number,
    @Req() req: Request,
  ) {
    if (!req.user || typeof req.user !== 'number') {
      throw new BadRequestException('Invalid user or user ID');
    }
    return this.saleService.getSaleLogItems(req.user, saleLogId);
  }
}
