import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { ProductVariant } from '../entities/product-variant.entity';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../dtos/product-variant.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return await this.productVariantRepo.find({
      relations: { product: true },
    });
  }

  async findOne(id: number) {
    const productVariant = await this.productVariantRepo.findOne({
      where: { id },
      relations: { product: true, orderitems: true },
    });
    if (!productVariant) {
      throw new NotFoundException('Variant del product no encontrada');
    }
    return productVariant;
  }

  async create(body: CreateProductVariantDto) {
    const { productId, ...variantsData } = body;
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product no encontrado');
    }
    const newProductVariant = this.productVariantRepo.create({
      ...variantsData,
      product,
    });
    try {
      return await this.productVariantRepo.save(newProductVariant);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: number, body: UpdateProductVariantDto) {
    const productVariant = await this.findOne(id);
    const { productId, ...variantData } = body;
    if (productId !== undefined) {
      const product = await this.productRepo.findOne({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException('Product no encontrado');
      }
      productVariant.product = product;
    }
    this.productVariantRepo.merge(productVariant, variantData);
    try {
      return await this.productVariantRepo.save(productVariant);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: number) {
    const productVariant = await this.findOne(id);
    if (productVariant.orderitems.length > 0) {
      throw new ConflictException(
        'No se puede eliminar la variante porque está asociada a uno o más pedidos',
      );
    }
    await this.productVariantRepo.remove(productVariant);
    return {
      message: 'Talla del product borrada correctamente',
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
      throw new ConflictException(
        'Ya existe una variante con esa talla y color para este producto',
      );
    }
    throw error;
  }
}
