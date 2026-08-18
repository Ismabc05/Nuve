import { Injectable } from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Lenovo IdeaPad',
      description: 'Portátil de 15 pulgadas para trabajo y estudio',
      price: 749.99,
      stock: 12,
      image: 'https://example.com/laptop.jpg',
    },
    {
      id: 2,
      name: 'iPhone 15',
      description: 'Smartphone Apple con 128 GB de almacenamiento',
      price: 799.99,
      stock: 8,
      image: 'https://example.com/laptop.jpg',
    },
  ];

  findAll() {
    return this.products;
  }

  findOne(id: number) {
    return this.products.find((product) => product.id === id);
  }

  create(newProduct: CreateProductDto) {
    const product: Product = {
      id: this.products.length + 1,
      ...newProduct,
    };
    this.products.push(product);
    return product;
  }

  update(id: number, updateProduct: UpdateProductDto) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      return null;
    }
    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateProduct,
    };
    return this.products[productIndex];
  }

  remove(id: number) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      return null;
    }

    return this.products.splice(productIndex, 1);
  }
}
