import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Put,
  Post,
  Delete,
  ParseIntPipe,
  Param,
  Body,
} from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { CategoriesService } from '../services/categories.service';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Category } from '../entities/category.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Obtiene todas las categorías.' })
  @ApiOkResponse({
    description: 'Categoría encontrada',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Categoría no encontrada',
  })
  @Get()
  finfAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene una categoría en especifico.' })
  @ApiOkResponse({
    description: 'Categoría encontrada',
    type: Category,
  })
  @ApiNotFoundResponse({
    description: 'Categoría no encontrada',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea una categoría.' })
  @ApiCreatedResponse({
    description: 'Categoría creada correctamente',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La categoría ya está registrada',
  })
  @Post()
  create(@Body() newCategory: CreateCategoryDto) {
    return this.categoriesService.create(newCategory);
  }

  @ApiOperation({ summary: 'Actualiza una categoría.' })
  @ApiCreatedResponse({
    description: 'Categoría actualizada correctamente',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La categoría ya está registrada',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategory: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategory);
  }

  @ApiOperation({ summary: 'Elimina una categoria.' })
  @ApiOkResponse({
    description: 'Categoría borrada',
    type: Category,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
