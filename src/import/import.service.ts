import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImportLogQueryDto, ImportLogDto } from './dto/import.dto';
import { Product, ImportLog } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ImportService {
  constructor(
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async importProducts(dto: ImportLogDto[], userId: number) {
    // Validate input
    if (!Array.isArray(dto) || dto.length === 0) {
      throw new BadRequestException('Invalid import data');
    }

    // Use a transaction to ensure all operations are atomic
    return this.prisma.$transaction(async (tx) => {
      const updatedProducts: Product[] = [];
      const importLogRecords: ImportLog[] = [];

      // Process each product in the input array
      for (const item of dto) {
        // Validate required fields
        if (!item.name || item.price === undefined || !item.productId) {
          throw new BadRequestException(
            'Required fields (name, price, productId) must be provided for all products',
          );
        }

        // Set quantity to 0 if not provided
        const quantity = item.quantity ?? 0;

        // Check if the product already exists
        const existingProduct = await tx.product.findUnique({
          where: {
            id_userId: {
              id: item.productId,
              userId,
            },
          },
        });

        // Determine timestamps
        const now = new Date();
        const createdAt = item.createdAt || now;
        const updatedAt = item.updatedAt || createdAt;

        let product: Product;

        if (existingProduct) {
          // Update existing product
          product = await tx.product.update({
            where: {
              id_userId: {
                id: item.productId,
                userId,
              },
            },
            data: {
              // Always update all fields except description which is optional
              name: item.name,
              price: item.price,
              description: item.description ?? existingProduct.description,
              stock: {
                increment: quantity, // Add to existing stock
              },
              updatedAt,
            },
          });
        } else {
          // Create new product
          product = await tx.product.create({
            data: {
              id: item.productId,
              name: item.name,
              price: item.price,
              description: item.description ?? null,
              stock: quantity,
              createdAt,
              updatedAt,
              userId,
            },
          });
        }

        updatedProducts.push(product);

        // Create ImportLog record
        const importLog = await tx.importLog.create({
          data: {
            name: item.name,
            quantity,
            price: item.price,
            description: item.description,
            createdAt,
            updatedAt,
            productId: item.productId,
            userId,
          },
        });

        importLogRecords.push(importLog);
      }

      // scan updatedProducts to retain the latest updatedAt corresponding to each product
      const productMap = new Map<string, Product>();
      updatedProducts.forEach((p) => {
        const existing = productMap.get(p.id);
        if (!existing || p.updatedAt > existing.updatedAt) {
          productMap.set(p.id, p);
        }
      });
      const finalProducts = Array.from(productMap.values());
      // Update the updatedProducts array to only include the latest versions
      updatedProducts.length = 0; // Clear the array
      updatedProducts.push(...finalProducts);

      // Emit an event for SSE updates
      this.eventEmitter.emit('products.updated', {
        userId,
        products: updatedProducts,
      });

      return {
        message: 'Import successful',
        productsCount: updatedProducts.length,
        logsCount: importLogRecords.length,
        // products: updatedProducts.map((p) => ({
        //   id: p.id,
        //   createdAt: p.createdAt,
        //   updatedAt: p.updatedAt,
        //   name: p.name,
        //   description: p.description,
        //   price: p.price,
        //   stock: p.stock,
        // })),
      };
    });
  }

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
