import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProductService } from './product.service';
import { ProductDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('product')
@UseGuards(JwtGuard)
@ApiBearerAuth('access-token')
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post('import')
  @ApiBody({ type: ProductDto })
  @ApiResponse({
    status: 201,
    description:
      'Tạo mới sản phẩm nếu không tìm thấy theo id hoặc cập nhật sản phẩm thành công',
    schema: {
      example: {
        message: 'Product imported successfully',
        product: {
          id: 1,
          createdAt: '2025-04-27T12:00:00.000Z',
          updatedAt: '2025-04-27T12:00:00.000Z',
          name: 'Táo đỏ Mỹ',
          price: 100000,
          quantity: 10,
          description: 'Táo đỏ nhập khẩu từ Mỹ',
        },
      },
    },
  })
  import(@Body() dto: ProductDto, @Req() req: Request) {
    console.log('Request Headers:', req.user);
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.productService.import(dto, req.user);
  }

  @Get('id/:id')
  @ApiParam({ name: 'id', type: Number, description: 'ID sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin sản phẩm theo ID',
    schema: {
      example: {
        id: 1,
        createdAt: '2025-04-27T12:00:00.000Z',
        updatedAt: '2025-04-27T12:00:00.000Z',
        name: 'Táo đỏ Mỹ',
        price: 100000,
        quantity: 10,
        description: 'Táo đỏ nhập khẩu từ Mỹ',
      },
    },
  })
  getProductById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.productService.getProductById(id, req.user);
  }

  @Get('name/:name')
  @ApiParam({ name: 'name', type: String, description: 'Tên sản phẩm' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin sản phẩm theo tên',
    schema: {
      example: {
        id: 1,
        createdAt: '2025-04-27T12:00:00.000Z',
        updatedAt: '2025-04-27T12:00:00.000Z',
        name: 'Táo đỏ Mỹ',
        price: 100000,
        quantity: 10,
        description: 'Táo đỏ nhập khẩu từ Mỹ',
      },
    },
  })
  getProductByName(@Param('name') name: string, @Req() req: Request) {
    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.productService.getProductByName(name, req.user);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description:
      'Lấy tất cả sản phẩm của người dùng có updatedAt lớn hơn lastTimeSync',
    schema: {
      example: [
        {
          id: 1,
          createdAt: '2025-04-27T12:00:00.000Z',
          updatedAt: '2025-04-27T12:00:00.000Z',
          name: 'Táo đỏ Mỹ',
          price: 100000,
          stock: 10,
          description: 'Táo đỏ nhập khẩu từ Mỹ',
          userId: 1,
        },
      ],
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid lastTimeSync format',
  })
  @ApiQuery({
    name: 'lastTimeSync',
    required: false,
    description:
      'Thời gian đồng bộ cuối cùng (ISO format). Nếu có, chỉ trả về sản phẩm được cập nhật sau thời gian này.',
    type: String,
  })
  getAllProducts(
    @Req() req: Request,
    @Query('lastTimeSync') lastTimeSync?: string,
  ) {
    // validate lastTimeSync format
    if (lastTimeSync && isNaN(Date.parse(lastTimeSync))) {
      throw new BadRequestException('Invalid lastTimeSync format');
    }

    if (!req.user || typeof req.user !== 'number') {
      throw new Error('Invalid user or user ID');
    }
    return this.productService.getAllProducts(req.user, lastTimeSync);
  }
}
