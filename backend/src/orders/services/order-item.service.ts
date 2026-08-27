import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItem, UpdateOrderItemDto } from '../dtos/order-item.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async findAll() {
    return await this.orderItemRepo.find();
  }

  async findOne(id: number) {
    const orderItem = await this.orderItemRepo.findOne({
      where: { id },
      relations: { order: true },
    });
    if (!orderItem) {
      throw new BadRequestException('Linea de pedido no encontrada');
    }
    return orderItem;
  }

  async create(body: CreateOrderItem) {
    const { orderId, ...itemData } = body;
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    const newOrderItem = this.orderItemRepo.create({
      ...itemData,
      order,
    });
    const saveOrderItem = await this.orderItemRepo.save(newOrderItem);
    await this.updateOrderTotal(orderId);
    return saveOrderItem;
  }

  async update(id: number, body: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);
    const updateOrderItem = this.orderItemRepo.merge(orderItem, body);
    const saveOrderItem = await this.orderItemRepo.save(updateOrderItem);
    await this.updateOrderTotal(orderItem.order.id);
    return saveOrderItem;
  }

  async remove(id: number) {
    const orderItem = await this.findOne(id);
    const orderId = orderItem.order.id;
    await this.orderItemRepo.remove(orderItem);
    await this.updateOrderTotal(orderId);
    return {
      message: 'Linea de pedido borrada correctamente',
    };
  }

  private async updateOrderTotal(orderId: number) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }

    const total = order.items.reduce((sum, item) => {
      return sum + Number(item.quantity) * Number(item.unitPrice);
    }, 0);

    order.total = total;

    await this.orderRepo.save(order);
  }
}
