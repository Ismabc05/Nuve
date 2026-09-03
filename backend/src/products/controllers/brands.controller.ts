import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';

import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { BrandsService } from '../services/brands.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Brand } from '../entities/brand.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('brands')
export class BrandsController {
  constructor(private brandService: BrandsService) {}

  @ApiOperation({ summary: 'Obtiene todas las marcas.' })
  @ApiOkResponse({
    description: 'Marca encontrada',
    type: Brand,
  })
  @ApiNotFoundResponse({
    description: 'Marca no encontrada',
  })
  @Get()
  findAll() {
    return this.brandService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene una marca en especifico.' })
  @ApiOkResponse({
    description: 'Marca encontrada',
    type: Brand,
  })
  @ApiNotFoundResponse({
    description: 'Marca no encontrada',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea una marca.' })
  @ApiCreatedResponse({
    description: 'Marca creada correctamente',
    type: Brand,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La marca ya está registrada',
  })
  @Post()
  create(@Body() newBrand: CreateBrandDto) {
    return this.brandService.create(newBrand);
  }

  @ApiOperation({ summary: 'Actualiza una marca.' })
  @ApiCreatedResponse({
    description: 'Marca actualizada correctamente',
    type: Brand,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La marca ya está registrada',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrand: UpdateBrandDto,
  ) {
    return this.brandService.update(id, updateBrand);
  }

  @ApiOperation({ summary: 'Elimina una marca.' })
  @ApiOkResponse({
    description: 'Marca borrada',
    type: Brand,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.remove(id);
  }
}
