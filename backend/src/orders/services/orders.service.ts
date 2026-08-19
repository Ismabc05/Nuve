import { Injectable } from '@nestjs/common';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UdateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [
    {
      id: 1,
      total: 24,
      status: 'esperando',
    },
    {
      id: 2,
      total: 10,
      status: 'enviado',
    },
  ];

  findAll() {
    return this.orders;
  }

  findOne(id: number) {
    const order = this.orders.find((order) => order.id === id);
    return order;
  }

  create(newOrder: CreateOrderDto) {
    const order: Order = {
      id: this.orders.length + 1,
      ...newOrder,
    };
    this.orders.push(order);
    return order;
  }

  update(id: number, updatedOrder: UdateOrderDto) {
    const orderIndex = this.orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      return null;
    }
    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      ...updatedOrder,
    };
    return this.orders[orderIndex];
  }

  remove(id: number) {
    const orderIndex = this.orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      return null;
    }
    return this.orders.splice(orderIndex, 1);
  }
}
