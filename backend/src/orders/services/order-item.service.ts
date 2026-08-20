import { Injectable } from '@nestjs/common';

import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderItem, UpdateOrderItemDto } from '../dtos/order-item.dto';

@Injectable()
export class OrderItemService {
  private orderItems: OrderItem[] = [
    {
      id: 1,
      quantity: 24,
      unitPrice: 2,
    },
    {
      id: 2,
      quantity: 10,
      unitPrice: 2,
    },
  ];

  findAll() {
    return this.orderItems;
  }

  findOne(id: number) {
    const orderItem = this.orderItems.find((order) => order.id === id);
    return orderItem;
  }

  create(newOrderItem: CreateOrderItem) {
    const orderItem: OrderItem = {
      id: this.orderItems.length + 1,
      ...newOrderItem,
    };
    this.orderItems.push(orderItem);
    return orderItem;
  }

  update(id: number, updateOrderItem: UpdateOrderItemDto) {
    const orderItemIndex = this.orderItems.findIndex(
      (orderItem) => orderItem.id === id,
    );
    if (orderItemIndex === -1) {
      return null;
    }
    this.orderItems[orderItemIndex] = {
      ...this.orderItems[orderItemIndex],
      ...updateOrderItem,
    };
    return this.orderItems[orderItemIndex];
  }

  remove(id: number) {
    const orderItemIndex = this.orderItems.findIndex(
      (orderItem) => orderItem.id === id,
    );
    if (orderItemIndex === -1) {
      return null;
    }
    return this.orderItems.splice(orderItemIndex, 1);
  }
}
