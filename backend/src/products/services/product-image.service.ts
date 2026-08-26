import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductImage } from '../entities/product-image.entity';
import {
  CreateProductImageDto,
  UpdateProductImageDto,
} from '../dtos/product-image.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private productImageRepo: Repository<ProductImage>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return await this.productImageRepo.find();
  }

  async findOne(id: number) {
    const productImage = await this.productImageRepo.findOne({
      where: { id },
      relations: { product: true },
    });
    if (!productImage) {
      throw new BadRequestException('Imagenes del product no encontradas');
    }
    return productImage;
  }

  async create(body: CreateProductImageDto) {
    const { productId, ...imagesData } = body;
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product no encontrado');
    }
    const newProductImage = this.productImageRepo.create({
      ...imagesData,
      product,
    });
    return this.productImageRepo.save(newProductImage);
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
