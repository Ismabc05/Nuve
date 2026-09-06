import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { UpdateOrderDto } from '../dtos/order.dto';
import { OrderStatus } from '../models/order.status';
import { User } from '../../users/entities/user.entitiy';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findAll() {
    return await this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: {
          productvariant: {
            product: true,
          },
        },
        user: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Order no encontrada');
    }
    return order;
  }

  async createOrder(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const activeOrder = await this.orderRepo.findOne({
      where: {
        user: { id: userId },
        status: OrderStatus.ACTIVE,
      },
    });

    if (activeOrder) {
      throw new ConflictException('El usuario ya tiene una orden activa');
    }

    const order = this.orderRepo.create({
      user,
      status: OrderStatus.ACTIVE,
      total: 0,
      items: [],
    });

    return await this.orderRepo.save(order);
  }

  async update(id: number, body: UpdateOrderDto) {
    const profile = await this.findOne(id);
    const updateOrder = this.orderRepo.merge(profile, body);
    const savedOrder = await this.orderRepo.save(updateOrder);
    return savedOrder;
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.ACTIVE) {
      throw new ConflictException(
        'No se puede eliminar un pedido que ya ha sido procesado',
      );
    }
    await this.orderRepo.remove(order);
    return {
      meesage: 'Pedido borrado correctamente',
    };
  }
}
