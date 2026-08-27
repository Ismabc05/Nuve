import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectRepository(Brand) private brandRepo: Repository<Brand>) {}

  async findAll() {
    return await this.brandRepo.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: { products: true },
    });
    if (!brand) {
      throw new NotFoundException('Marca no encontrada');
    }
    return brand;
  }

  async create(body: CreateBrandDto) {
    const createBrand = this.brandRepo.create(body);
    try {
      return await this.brandRepo.save(createBrand);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: number, body: UpdateBrandDto) {
    const brand = await this.brandRepo.findOne({
      where: { id },
    });
    if (!brand) {
      throw new NotFoundException('Marca no encontrada');
    }
    const updateBrand = this.brandRepo.merge(brand, body);
    try {
      return await this.brandRepo.save(updateBrand);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    if (brand.products.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la marca porque tiene productos asociados',
      );
    }
    await this.brandRepo.remove(brand);
    return {
      message: 'Marca borrada correctamente',
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
      throw new ConflictException('Ya existe una marca con ese nombre');
    }
    throw error;
  }
}
