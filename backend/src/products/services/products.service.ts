import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
  ) {}

  async findAll() {
    return await this.productRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        categories: true,
        variants: true,
        images: true,
        brand: true,
      },
    });
    if (!product) {
      throw new BadRequestException('Product no encontrado');
    }
    return product;
  }

  async create(body: CreateProductDto) {
    const { brandId, categories, ...productData } = body;
    const categoryEntity = await this.categoryRepo.find({
      where: categories.map((id) => ({ id })),
    });
    if (categoryEntity.length !== categories.length) {
      throw new NotFoundException('Una o más categorías no existen');
    }
    const brand = await this.brandRepo.findOne({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException('Marca no encontrafa');
    }
    const newProduct = this.productRepo.create({
      ...productData,
      brand,
      categories: categoryEntity,
    });
    const savedProduct = await this.productRepo.save(newProduct);
    return savedProduct;
  }

  async update(id: number, body: UpdateProductDto) {
    const product = await this.findOne(id);
    const { categories, ...productData } = body;
    if (categories) {
      const categoryEntities = await this.categoryRepo.find({
        where: categories.map((id) => ({ id })),
      });
      if (categoryEntities.length !== categories.length) {
        throw new NotFoundException('Una o más categorías no existen');
      }
      product.categories = categoryEntities;
    }
    this.productRepo.merge(product, productData);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return {
      message: 'Producto borrado correctamente',
    };
  }
}
