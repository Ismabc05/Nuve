import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return await this.productRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: {
        id,
      },
    });
    if (!product) {
      throw new BadRequestException('Product no encontrado');
    }
    return product;
  }

  async create(body: CreateProductDto) {
    const newProduct = this.productRepo.create(body);
    const saveProduct = await this.productRepo.save(newProduct);
    return saveProduct;
  }

  async update(id: number, body: UpdateProductDto) {
    const product = await this.findOne(id);
    const updateProduct = this.productRepo.merge(product, body);
    const saveProduct = await this.productRepo.save(updateProduct);
    return saveProduct;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return {
      message: 'Producto borrado correctamente',
    };
  }
}
