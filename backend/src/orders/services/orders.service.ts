import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UdateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectRepository(Order) private orderRepo: Repository<Order>) {}

  async findAll() {
    return await this.orderRepo.find();
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: { items: true, user: true },
    });
    if (!order) {
      throw new NotFoundException('Order no encontrada');
    }
    return order;
  }

  async create(body: CreateOrderDto) {
    const createProfile = this.orderRepo.create(body);
    const savedProfile = await this.orderRepo.save(createProfile);
    return savedProfile;
  }

  async update(id: number, body: UdateOrderDto) {
    const profile = await this.findOne(id);
    const updateOrder = this.orderRepo.merge(profile, body);
    const savedOrder = await this.orderRepo.save(updateOrder);
    return savedOrder;
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    await this.orderRepo.remove(profile);
    return {
      meesage: 'Pedido borrado correctamente',
    };
  }
}
