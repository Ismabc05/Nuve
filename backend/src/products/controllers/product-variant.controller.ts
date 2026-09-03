import { Controller, UseGuards } from '@nestjs/common';
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
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ProductVariant } from '../entities/product-variant.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('product-variant')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @ApiOperation({ summary: 'Obtiene todas las variantes del producto.' })
  @ApiOkResponse({
    description: 'Variante encontrada',
    type: ProductVariant,
  })
  @ApiNotFoundResponse({
    description: 'Perfil no encontrado',
  })
  @Get()
  findAll() {
    return this.productVariantService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene una variante del producto.' })
  @ApiOkResponse({
    description: 'Variante encontrada',
    type: ProductVariant,
  })
  @ApiNotFoundResponse({
    description: 'Perfil no encontrado',
  })
  @Get(':id')
  finOne(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea una variante del producto.' })
  @ApiCreatedResponse({
    description: 'Variante creada correctamente',
    type: ProductVariant,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La variante ya está registrada',
  })
  @Post()
  create(@Body() newProductVariant: CreateProductVariantDto) {
    return this.productVariantService.create(newProductVariant);
  }

  @ApiOperation({ summary: 'Actualiza una variante del producto.' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductVariant: UpdateProductVariantDto,
  ) {
    return this.productVariantService.update(id, updateProductVariant);
  }

  @ApiOperation({ summary: 'Elimina una variante del producto' })
  @ApiOkResponse({
    description: 'Variante borrada',
    type: ProductVariant,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productVariantService.remove(id);
  }
}
