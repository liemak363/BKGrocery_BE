import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImportLogQueryDto } from './dto/import.dto';

@Injectable()
export class ImportService {
  constructor(private prisma: PrismaService) {}

  async getImportLogs(userId: number, queryDto: ImportLogQueryDto) {
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

    const importLogs = await this.prisma.importLog.findMany({
      where,
      include: {
        product: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: queryDto.offset,
      take: queryDto.limit,
    });

    return {
      data: importLogs,
    };
  }
}
