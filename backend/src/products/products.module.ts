import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { CategoriesController } from './controllers/categories.controller';
import { ProductsService } from './services/products.service';
import { CategoriesService } from './services/categories.service';
import { BrandsController } from './controllers/brands.controller';
import { BrandsService } from './services/brands.service';
import { ProductVariantController } from './controllers/product-variant.controller';
import { ProductImageController } from './controllers/product-image.controller';
import { ProductVariantService } from './services/product-variant.service';
import { ProductImageService } from './services/product-image.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand,
      Category,
      ProductImage,
      ProductVariant,
      Product,
    ]),
  ],
  controllers: [
    ProductsController,
    CategoriesController,
    BrandsController,
    ProductVariantController,
    ProductImageController,
  ],
  providers: [
    ProductsService,
    CategoriesService,
    BrandsService,
    ProductVariantService,
    ProductImageService,
  ],
  exports: [
    ProductsService,
    CategoriesService,
    BrandsService,
    ProductVariantService,
    ProductImageService,
  ],
})
export class ProductsModule {}
