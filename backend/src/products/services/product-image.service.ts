import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductImage } from '../entities/product-image.entity';
import {
  CreateProductImageDto,
  UpdateProductImageDto,
} from '../dtos/product-image.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private productImageRepo: Repository<ProductImage>,
  ) {}

  async findAll() {
    return await this.productImageRepo.find();
  }

  async findOne(id: number) {
    const productImage = await this.productImageRepo.findOne({
      where: {
        id,
      },
    });
    if (!productImage) {
      throw new BadRequestException('Imagenes del product no encontradas');
    }
    return productImage;
  }

  async create(body: CreateProductImageDto) {
    const newProductImage = this.productImageRepo.create(body);
    const savedProductImage = await this.productImageRepo.save(newProductImage);
    return savedProductImage;
  }

  async update(id: number, body: UpdateProductImageDto) {
    const productImage = await this.findOne(id);
    const updateProductImage = this.productImageRepo.merge(productImage, body);
    const savedProductImage =
      await this.productImageRepo.save(updateProductImage);
    return savedProductImage;
  }

  async remove(id: number) {
    const productImage = await this.findOne(id);
    await this.productImageRepo.remove(productImage);
    return {
      message: 'Imagen del producto borrado correctamente',
    };
  }
}
