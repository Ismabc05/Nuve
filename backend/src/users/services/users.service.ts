import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../entities/user.entitiy';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { OrderStatus } from '../../orders/models/order.status';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
  ) {}

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async create(body: CreateUserDto) {
    const { email, password, name } = body;
    const newUser = this.userRepo.create({
      email,
      password,
      profile: {
        // Dentro de profile meto name y las demas propiedades opcionales que estan dentro de perfil
        name,
      },
      orders: [
        {
          status: OrderStatus.ACTIVE,
          total: 0,
        },
      ],
    });
    const savedUser = await this.userRepo.save(newUser);
    return savedUser;
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = this.userRepo.merge(user, body);
    const savedUser = await this.userRepo.save(updatedUser);
    return savedUser;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return {
      message: 'User borrado correctamente',
    };
  }
}
