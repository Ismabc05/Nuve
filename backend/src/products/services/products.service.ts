import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

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
    return await this.productRepo.find({
      relations: {
        brand: true,
        categories: true,
      },
    });
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
      throw new NotFoundException('Product no encontrado');
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
      throw new NotFoundException('Marca no encontrada');
    }
    const newProduct = this.productRepo.create({
      ...productData,
      brand,
      categories: categoryEntity,
    });
    try {
      return await this.productRepo.save(newProduct);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async update(id: number, body: UpdateProductDto) {
    const product = await this.findOne(id);
    const { categories, brandId, ...productData } = body;
    if (categories !== undefined) {
      const categoryEntities = await this.categoryRepo.find({
        where: categories.map((id) => ({ id })),
      });
      if (categoryEntities.length !== categories.length) {
        throw new NotFoundException('Una o más categorías no existen');
      }
      product.categories = categoryEntities;
    }
    if (brandId !== undefined) {
      const brand = await this.brandRepo.findOne({
        where: { id: brandId },
      });
      if (!brand) {
        throw new NotFoundException('Marca no encontrada');
      }
      product.brand = brand;
    }
    this.productRepo.merge(product, productData);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    await this.productRepo.remove(product);
    return {
      message: 'Producto borrado correctamente',
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
      throw new ConflictException('Ya existe una producto con ese nombre');
    }
    throw error;
  }

  async createReview(
    productId: number,
    review: { userId: number; rating: number; comment: string },
  ) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    const reviews = product.reviews ?? [];
    const newReview = {
      id: reviews.length > 0 ? reviews[reviews.length - 1].id + 1 : 1,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
    };
    reviews.push(newReview);
    product.reviews = reviews;
    return this.productRepo.save(product);
  }

  async getReviews(productId: number) {
    const product = await this.findOne(productId);
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    return product.reviews ?? [];
  }

  async deleteReview(productId: number, reviewId: number, userId: number) {
    const product = await this.findOne(productId);

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const reviews = product.reviews ?? [];

    const review = reviews.find(
      (review) => review.id === reviewId && review.userId === userId,
    );

    if (!review) {
      throw new NotFoundException('Review no encontrada');
    }

    product.reviews = reviews.filter((review) => review.id !== reviewId);

    return this.productRepo.save(product);
  }
}
