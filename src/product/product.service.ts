import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto, ProductQueryDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async import(dto: ProductDto, userId: number) {
    // Find if the product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id_userId: {
          // Use the composite key format
          id: dto.id,
          userId: userId,
        },
      },
    });

    if (!existingProduct) {
      // Product doesn't exist, create a new one
      try {
        const newProduct = await this.prisma.product.create({
          data: {
            id: dto.id,
            name: dto.name,
            price: dto.price,
            description: dto.description,
            stock: dto.quantity, // Map quantity from DTO to stock in database
            userId: userId,
          },
        });
        return {
          message: 'Product created successfully',
          product: newProduct,
        };
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ConflictException(
              'Product name already exists for this user. Please use a different name.',
            );
          }
        }
        throw error;
      }
    } else {
      // Product exists, update name, price, description and add quantity to stock
      const updatedProduct = await this.prisma.product.update({
        where: {
          id_userId: {
            // Use the composite key format
            id: dto.id,
            userId: userId,
          },
        },
        data: {
          name: dto.name,
          price: dto.price,
          description: dto.description,
          stock: {
            increment: dto.quantity, // Add the new quantity to the existing stock
          },
        },
      });
      return {
        message: 'Product updated successfully',
        product: updatedProduct,
      };
    }
  }

  async getAllProducts(userId: number, productQuery: ProductQueryDto) {
    // query specific product if id is provided
    if (productQuery.id) {
      const product = await this.prisma.product.findUnique({
        where: {
          id_userId: {
            // Use the composite key format
            id: productQuery.id,
            userId,
          },
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${productQuery.id} not found`,
        );
      }

      return product;
    }

    // query specific product if name is provided
    if (productQuery.name) {
      const product = await this.prisma.product.findUnique({
        where: {
          name_userId: {
            // Use the composite key format for the name and userId unique constraint
            name: productQuery.name,
            userId,
          },
        },
      });

      if (!product) {
        throw new NotFoundException(
          `Product with name '${productQuery.name}' not found`,
        );
      }

      return product;
    }

    // Define the where condition with proper typing
    const whereCondition: {
      userId: number;
      updatedAt?: { gt: Date };
    } = {
      userId,
    };

    // If lastTimeSync is provided, filter products updated after that time
    if (productQuery.lastTimeSync) {
      const lastTimeSyncDate = productQuery.lastTimeSync;
      try {
        whereCondition.updatedAt = {
          gt: lastTimeSyncDate,
        };
      } catch {
        throw new Error(
          'Invalid lastTimeSync format. Please provide a valid date string.',
        );
      }
    }

    const products = await this.prisma.product.findMany({
      where: whereCondition,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return products;
  }
}
