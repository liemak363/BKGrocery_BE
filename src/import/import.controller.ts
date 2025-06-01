import {
  Controller,
  UseGuards,
  Query,
  Get,
  Req,
  Body,
  Post,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { ImportService } from './import.service';
import { Request } from 'express';
import { ImportLogQueryDto, ImportLogDto } from './dto/import.dto';

@ApiTags('import')
@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@Controller('import')
export class ImportController {
  private logger = new Logger(ImportController.name);

  constructor(private importService: ImportService) {
    this.logger.log('ImportController constructor called');
  }

  @Post()
  @ApiBody({ type: ImportLogDto, isArray: true })
  @ApiResponse({
    status: 201,
    description: 'Products imported successfully',
    schema: {
      example: {
        message: 'Import successful',
        productsCount: 2,
        logsCount: 2,
      },
    },
  })
  importProducts(@Body() dto: ImportLogDto[], @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new BadRequestException('Invalid user or user ID');
    }
    this.logger.log(`importProducts endpoint called with user ID: ${req.user}`);
    return this.importService.importProducts(dto, req.user);
  }

  @Get('log')
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách log nhập hàng của người dùng',
    schema: {
      example: {
        data: [
          {
            id: 1,
            quantity: 10,
            price: 100000,
            description: 'Táo đỏ nhập khẩu từ Mỹ',
            createdAt: '2025-05-26T00:00:00.000Z',
            updatedAt: '2025-05-26T00:00:00.000Z',
            productId: 1,
            userId: 1,
            product: {
              name: 'Táo đỏ Mỹ',
            },
          },
        ],
        count: 1,
      },
    },
  })
  getImportLogs(@Query() query: ImportLogQueryDto, @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new BadRequestException('Invalid user or user ID');
    }
    return this.importService.getImportLogs(req.user, query);
  }
}
