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
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../dtos/product-variant.dto';

import { ProductVariantService } from '../services/product-variant.service';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @Get()
  findAll() {
    return this.productVariantService.findAll();
  }

  @Get(':id')
  finOne(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantService.findOne(id);
  }

  @Post()
  create(@Body() newProductVariant: CreateProductVariantDto) {
    return this.productVariantService.create(newProductVariant);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductVariant: UpdateProductVariantDto,
  ) {
    return this.productVariantService.update(id, updateProductVariant);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantService.remove(id);
  }
}
