import { Injectable } from '@nestjs/common';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [
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
    return this.brands;
  }

  findOne(id: number) {
    const brand = this.brands.find((brand) => brand.id === id);
    return brand;
  }

  create(newBrand: CreateBrandDto) {
    const brand: Brand = {
      id: this.brands.length + 1,
      ...newBrand,
    };
    this.brands.push(brand);
    return brand;
  }

  update(id: number, updateBrand: UpdateBrandDto) {
    const brandIndex = this.brands.findIndex((brand) => brand.id === id);
    if (brandIndex === -1) {
      return null;
    }
    this.brands[brandIndex] = {
      ...this.brands[brandIndex],
      ...updateBrand,
    };
    return this.brands[brandIndex];
  }

  remove(id: number) {
    const brandIndex = this.brands.findIndex((brand) => brand.id === id);
    if (brandIndex === -1) {
      return null;
    }

    return this.brands.splice(brandIndex, 1);
  }
}
