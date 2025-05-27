import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getSaleLogItems(userId: number, saleLogId: number) {
    // Kiểm tra xem SaleLog có tồn tại không và thuộc về user hiện tại
    const saleLog = await this.prisma.saleLog.findUnique({
      where: {
        id: saleLogId,
        userId: userId,
      },
    });

    if (!saleLog) {
      throw new NotFoundException('Sale log not found');
    }

    // Truy vấn các item của SaleLog kèm theo thông tin sản phẩm
    const saleLogItems = await this.prisma.saleLogItem.findMany({
      where: {
        saleLogId: saleLogId,
      },
      include: {
        product: {
          select: {
            name: true,
            description: true,
          },
        },
      },
    });

    return {
      saleLog: saleLog,
      items: saleLogItems.map((item) => ({
        saleLogId: item.saleLogId,
        productId: item.productId,
        price: item.price,
        quantity: item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        productName: item.product.name,
        productDescription: item.product.description,
        total: item.price * item.quantity,
      })),
    };
  }
}
