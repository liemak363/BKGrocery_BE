import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { JwtGuard } from 'src/auth/guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { SaleLogQueryDto } from './dto/sale.dto';

@ApiTags('sale')
@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@Controller('sale')
export class SaleController {
  constructor(private saleService: SaleService) {}

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
