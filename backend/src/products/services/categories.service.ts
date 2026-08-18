import { Injectable } from '@nestjs/common';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    {
      id: 1,
      name: 'Laptop Lenovo IdeaPad',
    },
    {
      id: 2,
      name: 'iPhone 15',
    },
  ];

  findAll() {
    return this.categories;
  }

  findOne(id: number) {
    const category = this.categories.find((category) => category.id === id);
    return category;
  }

  create(newCategory: CreateCategoryDto) {
    const category: Category = {
      id: this.categories.length + 1,
      ...newCategory,
    };
    this.categories.push(category);
    return category;
  }

  update(id: number, updateCategory: UpdateCategoryDto) {
    const categoryIndex = this.categories.findIndex(
      (category) => category.id === id,
    );
    if (categoryIndex === -1) {
      return null;
    }

    this.categories[categoryIndex] = {
      ...this.categories[categoryIndex],
      ...updateCategory,
    };
    return this.categories[categoryIndex];
  }

  remove(id: number) {
    const categoryIndex = this.categories.findIndex(
      (category) => category.id === id,
    );
    if (categoryIndex === -1) {
      return null;
    }

    return this.categories.splice(categoryIndex, 1);
  }
}
