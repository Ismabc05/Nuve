import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {}

  async findAll() {
    return await this.brandRepo.find();
  }

  async findOne(id: number) {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: { products: true },
    });
    if (!brand) {
      throw new BadRequestException('Marca no econtrada');
    }
    return brand;
  }

  async create(body: CreateBrandDto) {
    const createBrand = this.brandRepo.create(body);
    const saveBrand = await this.brandRepo.save(createBrand);
    return saveBrand;
  }

  async update(id: number, body: UpdateBrandDto) {
    const brand = await this.findOne(id);
    const updateBrand = this.brandRepo.merge(brand, body);
    const saveBrand = await this.brandRepo.save(updateBrand);
    return saveBrand;
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepo.remove(brand);
    return {
      message: 'Marca borrada correctamente',
    };
  }
}
