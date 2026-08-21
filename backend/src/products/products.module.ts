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

@Module({
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
})
export class ProductsModule {}
