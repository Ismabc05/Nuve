import { Controller } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import {
  CreateProductImageDto,
  UpdateProductImageDto,
} from '../dtos/product-image.dto';
import { ProductImageService } from '../services/product-image.service';

@Controller('product-image')
export class ProductImageController {
  constructor(private productImageService: ProductImageService) {}

  @Get()
  findAll() {
    return this.productImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.findOne(id);
  }

  @Post()
  create(@Body() newProductImage: CreateProductImageDto) {
    return this.productImageService.create(newProductImage);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductImage: UpdateProductImageDto,
  ) {
    return this.productImageService.update(id, updateProductImage);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.remove(id);
  }
}
