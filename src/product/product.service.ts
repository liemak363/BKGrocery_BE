import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async import(dto: ProductDto, userId: number) {
    // Find if the product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!existingProduct) {
      // Product doesn't exist, create a new one
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
    } else {
      // Product exists, update name, price, description and add quantity to stock
      const updatedProduct = await this.prisma.product.update({
        where: {
          id: dto.id,
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
}
