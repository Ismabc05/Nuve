import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepo.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: { products: true },
    });
    if (!category) {
      throw new NotFoundException('Categoria no encontrada');
    }
    return category;
  }

  async create(body: CreateCategoryDto) {
    const newCategory = this.categoryRepo.create(body);
    try {
      return await this.categoryRepo.save(newCategory);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: number, body: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Categoria no encontrada');
    }
    const updatedCategory = this.categoryRepo.merge(category, body);
    try {
      return await this.categoryRepo.save(updatedCategory);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (category.products.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la categoria porque tiene productos asociados',
      );
    }
    await this.categoryRepo.remove(category);
    return {
      message: 'Categoria borrada correctamente',
    };
  }

  private handleDatabaseError(error: unknown) {
    if (
      error instanceof QueryFailedError &&
      error.driverError &&
      'code' in error.driverError &&
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      error.driverError.code === '23505'
    ) {
      throw new ConflictException('Ya existe una categoria con ese nombre');
    }
    throw error;
  }
}
