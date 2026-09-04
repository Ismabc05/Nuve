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

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/models/user.role';
import { RolesGuard } from '../../auth/guards/role.guard';

@Controller('product-image')
export class ProductImageController {
  constructor(private productImageService: ProductImageService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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
