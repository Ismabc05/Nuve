import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { ProductsService } from '../services/products.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Product } from '../entities/product.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @ApiOperation({ summary: 'Obtiene todos los productos.' })
  @ApiOkResponse({
    description: 'Producto encontrado',
    type: Product,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene un producto en especifico.' })
  @ApiOkResponse({
    description: 'Producto encontrado',
    type: Product,
  })
  @ApiNotFoundResponse({
    description: 'Producto no encontrado',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea un producto.' })
  @ApiCreatedResponse({
    description: 'Producto creado correctamente',
    type: Product,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El producto ya está registrado',
  })
  @Post()
  create(@Body() newProduct: CreateProductDto) {
    return this.productService.create(newProduct);
  }

  @ApiOperation({ summary: 'Actualiza un producto.' })
  @ApiCreatedResponse({
    description: 'Producto actualizado correctamente',
    type: Product,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El producto ya está registrado',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProduct: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProduct);
  }

  @ApiOperation({ summary: 'Elimina un producto.' })
  @ApiOkResponse({
    description: 'Producto borrado',
    type: Product,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
