import { Injectable } from '@nestjs/common';

import { ProductImage } from '../entities/product-image.entity';
import {
  CreateProductImageDto,
  UpdateProductImageDto,
} from '../dtos/product-image.dto';

@Injectable()
export class ProductImageService {
  private productImages: ProductImage[] = [
    {
      id: 1,
      url: 'https://example.com/laptop.jpg',
    },
    {
      id: 2,
      url: 'https://example.com/laptop.jpg',
    },
  ];

  findAll() {
    return this.productImages;
  }

  findOne(id: number) {
    const productImage = this.productImages.find(
      (productImage) => productImage.id === id,
    );
    return productImage;
  }

  create(body: CreateProductImageDto) {
    const newProductImage: ProductImage = {
      id: this.productImages.length + 1,
      ...body,
    };
    this.productImages.push(newProductImage);
    return newProductImage;
  }

  update(id: number, body: UpdateProductImageDto) {
    const productImageIndex = this.productImages.findIndex(
      (productImage) => productImage.id === id,
    );
    if (productImageIndex === -1) {
      return null;
    }

    this.productImages[productImageIndex] = {
      ...this.productImages[productImageIndex],
      ...body,
    };
    return this.productImages[productImageIndex];
  }

  remove(id: number) {
    const productImageIndex = this.productImages.findIndex(
      (productImage) => productImage.id === id,
    );
    if (productImageIndex === -1) {
      return null;
    }
    return this.productImages.splice(productImageIndex, 1);
  }
}
