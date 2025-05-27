import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaleLogQueryDto } from './dto';

@Injectable()
export class SaleService {
  constructor(private prisma: PrismaService) {}

  async getSaleLog(userId: number, queryDto: SaleLogQueryDto) {
    // init where clause
    const where: {
      userId: number;
      createdAt?: { lt: Date };
    } = {
      userId,
    };

    // add lastTime condition if provided
    if (queryDto.lastTime) {
      where.createdAt = {
        lt: queryDto.lastTime,
      };
    }

    const saleLogs = await this.prisma.saleLog.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: queryDto.offset,
      take: queryDto.limit,
    });

    return {
      data: saleLogs,
    };
  }
}
