import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItem, UpdateOrderItemDto } from '../dtos/order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
  ) {}

  async findAll() {
    return await this.orderItemRepo.find();
  }

  async findOne(id: number) {
    const orderItem = await this.orderItemRepo.findOne({
      where: {
        id,
      },
    });
    if (!orderItem) {
      throw new BadRequestException('Linea de pedido no encontrada');
    }
    return orderItem;
  }

  async create(body: CreateOrderItem) {
    const createOrder = this.orderItemRepo.create(body);
    const savedOrder = await this.orderItemRepo.save(createOrder);
    return savedOrder;
  }

  async update(id: number, body: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);
    const updateOrderItem = this.orderItemRepo.merge(orderItem, body);
    const saveOrderItem = await this.orderItemRepo.save(updateOrderItem);
    return saveOrderItem;
  }
  async remove(id: number) {
    const orderItem = await this.findOne(id);
    await this.orderItemRepo.remove(orderItem);
    return {
      message: 'Linea de pedido borrada correctamente',
    };
  }
}
