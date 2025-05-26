import { Controller, UseGuards, Query, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { ImportService } from './import.service';
import { Request } from 'express';
import { ImportLogQueryDto } from './dto/import.dto';

@ApiTags('import')
@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@Controller('import')
export class ImportController {
  constructor(private importService: ImportService) {}

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
      },
    },
  })
  getImportLogs(@Query() query: ImportLogQueryDto, @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.importService.getImportLogs(req.user, query);
  }
}
