import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  async findAll() {
    return await this.categoryRepo.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new BadRequestException('Categoria no encontrada');
    }
    return category;
  }

  async create(body: CreateCategoryDto) {
    const newCategory = this.categoryRepo.create(body);
    const saveCategory = await this.categoryRepo.save(newCategory);
    return saveCategory;
  }

  async update(id: number, body: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const updatedCategory = this.categoryRepo.merge(category, body);
    const savedCategory = await this.categoryRepo.save(updatedCategory);
    return savedCategory;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return {
      message: 'Categoria borrada correctamente',
    };
  }
}
