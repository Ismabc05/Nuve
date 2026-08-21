import { Injectable } from '@nestjs/common';

import { ProductVariant } from '../entities/product-variant.entity';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from '../dtos/product-variant.dto';

@Injectable()
export class ProductVariantService {
  private productVariants: ProductVariant[] = [
    {
      id: 1,
      size: 'M',
      color: 'red',
      stock: 10,
    },
    {
      id: 2,
      size: 'S',
      color: 'blue',
      stock: 5,
    },
  ];

  findAll() {
    return this.productVariants;
  }

  findOne(id: number) {
    const productVariant = this.productVariants.find(
      (productVariant) => productVariant.id === id,
    );
    return productVariant;
  }

  create(body: CreateProductVariantDto) {
    const newProductVariant: ProductVariant = {
      id: this.productVariants.length + 1,
      ...body,
    };
    this.productVariants.push(newProductVariant);
    return newProductVariant;
  }

  update(id: number, body: UpdateProductVariantDto) {
    const productVariantIndex = this.productVariants.findIndex(
      (productVariant) => productVariant.id === id,
    );
    if (productVariantIndex === -1) {
      return null;
    }
    this.productVariants[productVariantIndex] = {
      ...this.productVariants[productVariantIndex],
      ...body,
    };
    return this.productVariants[productVariantIndex];
  }

  remove(id: number) {
    const productVariantIndex = this.productVariants.findIndex(
      (productVariant) => productVariant.id === id,
    );
    if (productVariantIndex === -1) {
      return null;
    }
    return this.productVariants.splice(productVariantIndex, 1);
  }
}
