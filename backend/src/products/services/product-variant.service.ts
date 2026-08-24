import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductVariant } from '../entities/product-variant.entity';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../dtos/product-variant.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
  ) {}

  async findAll() {
    return await this.productVariantRepo.find();
  }

  async findOne(id: number) {
    const productVariant = await this.productVariantRepo.findOne({
      where: {
        id,
      },
    });
    if (!productVariant) {
      throw new BadRequestException('Talla no econtrada');
    }
    return productVariant;
  }

  async create(body: CreateProductVariantDto) {
    const newProductVariant = this.productVariantRepo.create(body);
    const savedProductVariant =
      await this.productVariantRepo.save(newProductVariant);
    return savedProductVariant;
  }

  async update(id: number, body: UpdateProductVariantDto) {
    const productVariant = await this.findOne(id);
    const updateProductVariant = this.productVariantRepo.merge(
      productVariant,
      body,
    );
    const savedProductVariant =
      await this.productVariantRepo.save(updateProductVariant);
    return savedProductVariant;
  }

  async remove(id: number) {
    const productVariant = await this.findOne(id);
    await this.productVariantRepo.remove(productVariant);
    return {
      message: 'Talla del product borrada correctamente',
    };
  }
}
