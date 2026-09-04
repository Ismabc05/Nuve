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
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/models/user.role';
import { RolesGuard } from '../../auth/guards/role.guard';

@Controller('product-variant')
export class ProductVariantController {
  constructor(private productVariantService: ProductVariantService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualiza una variante del producto.' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductVariant: UpdateProductVariantDto,
  ) {
    return this.productVariantService.update(id, updateProductVariant);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
