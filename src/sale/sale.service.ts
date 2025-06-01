import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaleLogQueryDto, SaleLogDto } from './dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Product } from '@prisma/client';

@Injectable()
export class SaleService {
  constructor(
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createSale(userId: number, dto: SaleLogDto[]) {
    // Validate input
    if (!Array.isArray(dto) || dto.length === 0) {
      throw new BadRequestException('No sale items provided');
    }

    // Use a transaction to ensure all operations are atomic
    return this.prisma.$transaction(async (tx) => {
      const updatedProducts: Product[] = [];
      const now = new Date();

      for (const sale of dto) {
        // Validate required fields
        if (
          !sale.items ||
          !Array.isArray(sale.items) ||
          sale.items.length === 0
        ) {
          throw new BadRequestException('Sale items must be provided');
        }

        // Calculate the total amount from all items
        let calculatedTotal = 0;
        if (sale.total) calculatedTotal = sale.total;

        if (calculatedTotal <= 0) {
          // Validate items and check product availability
          for (const item of sale.items) {
            if (!item.productId || !item.price || !item.quantity) {
              throw new BadRequestException(
                'Product ID, price, and quantity are required for all items',
              );
            }

            // Check if product exists and has enough stock
            const product = await tx.product.findUnique({
              where: {
                id_userId: {
                  id: item.productId,
                  userId,
                },
              },
            });

            if (!product) {
              throw new BadRequestException(
                `Product with ID ${item.productId} not found`,
              );
            }

            if (product.stock < item.quantity) {
              throw new BadRequestException(
                `Insufficient stock for product ${product.name} (ID: ${item.productId}). Available: ${product.stock}, Requested: ${item.quantity}`,
              );
            }

            calculatedTotal += item.price * item.quantity;
          }
        }

        // Create SaleLog with total amount
        const saleLog = await tx.saleLog.create({
          data: {
            total: calculatedTotal,
            userId,
            createdAt: sale.createdAt || now,
            updatedAt: sale.updatedAt || sale.createdAt,
          },
        });

        console.log(saleLog);

        // Process each item in the sale
        for (const item of sale.items) {
          // Create SaleLogItem with the userId to correctly reference the product
          await tx.saleLogItem.create({
            data: {
              saleLogId: saleLog.id,
              productId: item.productId,
              userId: userId,
              price: item.price,
              quantity: item.quantity,
            },
          });

          // Update product stock
          const updatedProduct = await tx.product.update({
            where: {
              id_userId: {
                id: item.productId,
                userId,
              },
            },
            data: {
              stock: {
                decrement: item.quantity, // Reduce stock by sold quantity
              },
              updatedAt: now,
            },
          });

          updatedProducts.push(updatedProduct);
        }
      }

      // Remove duplicates and keep only the latest version of each product
      const productMap = new Map<string, Product>();
      updatedProducts.forEach((p) => {
        const existing = productMap.get(p.id);
        if (!existing || p.updatedAt > existing.updatedAt) {
          productMap.set(p.id, p);
        }
      });
      const finalProducts = Array.from(productMap.values());

      // Emit an event for SSE updates
      this.eventEmitter.emit('products.updated', {
        userId,
        products: finalProducts,
      });

      return {
        message: 'Sale created successfully',
        productsUpdated: finalProducts.length,
      };
    });
  }

  async getSaleLog(userId: number, queryDto: SaleLogQueryDto) {
    if (queryDto.saleLogId) {
      // Kiểm tra xem SaleLog có tồn tại không và thuộc về user hiện tại
      const saleLog = await this.prisma.saleLog.findUnique({
        where: {
          id: queryDto.saleLogId,
          userId: userId,
        },
      });

      if (!saleLog) {
        throw new NotFoundException('Sale log not found');
      }

      // Truy vấn các item của SaleLog kèm theo thông tin sản phẩm
      const saleLogItems = await this.prisma.saleLogItem.findMany({
        where: {
          saleLogId: queryDto.saleLogId,
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
          productName: item.product.name,
          productDescription: item.product.description,
          total: item.price * item.quantity,
        })),
      };
    }

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

    // count total records - no pagination
    const totalCount = await this.prisma.saleLog.count({
      where,
    });

    return {
      data: saleLogs,
      count: totalCount,
    };
  }
}
