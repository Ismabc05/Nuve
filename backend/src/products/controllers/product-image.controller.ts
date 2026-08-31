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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ProductImage } from '../entities/product-image.entity';

@Controller('product-image')
export class ProductImageController {
  constructor(private productImageService: ProductImageService) {}

  @ApiOperation({ summary: 'Obtiene las imagenes del producto.' })
  @ApiOkResponse({
    description: 'Imagen encontrada',
    type: ProductImage,
  })
  @ApiNotFoundResponse({
    description: 'Imagen no encontrada',
  })
  @Get()
  findAll() {
    return this.productImageService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene una imagen del producto.' })
  @ApiOkResponse({
    description: 'Imagen encontrada',
    type: ProductImage,
  })
  @ApiNotFoundResponse({
    description: 'Imagen no encontrada',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea una imagen del producto.' })
  @ApiCreatedResponse({
    description: 'Imagen creada correctamente',
    type: ProductImage,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La imagen ya está registrada',
  })
  @Post()
  create(@Body() newProductImage: CreateProductImageDto) {
    return this.productImageService.create(newProductImage);
  }

  @ApiOperation({ summary: 'Actualiza una imagen del producto.' })
  @ApiCreatedResponse({
    description: 'Imagen actualizada correctamente',
    type: ProductImage,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La imagen ya está registrada',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductImage: UpdateProductImageDto,
  ) {
    return this.productImageService.update(id, updateProductImage);
  }

  @ApiOperation({ summary: 'Elimina una imagen del producto.' })
  @ApiOkResponse({
    description: 'Imagen borrada',
    type: ProductImage,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productImageService.remove(id);
  }
}
