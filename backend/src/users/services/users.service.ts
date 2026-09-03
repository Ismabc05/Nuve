import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../entities/user.entitiy';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderStatus } from '../../orders/models/order.status';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll() {
    return await this.userRepo.find({
      relations: { profile: true },
    });
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

  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException(`User #${email} not found`);
    }
    return user;
  }

  async create(body: CreateUserDto) {
    const { email, password, name, lastname, phone, address, zipCode, image } =
      body;

    const hashPassword = await argon2.hash(password);

    const newUser = this.userRepo.create({
      email,
      password: hashPassword,

      profile: {
        name,
        lastname,
        phone,
        address,
        zip_code: zipCode,
        image,
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

    const { name, lastname, phone, address, zipCode, image, ...userData } =
      body;

    this.userRepo.merge(user, userData);

    if (user.profile) {
      user.profile.name = name ?? user.profile.name;
      user.profile.lastname = lastname ?? user.profile.lastname;
      user.profile.phone = phone ?? user.profile.phone;
      user.profile.address = address ?? user.profile.address;
      user.profile.zip_code = zipCode ?? user.profile.zip_code;
      user.profile.image = image ?? user.profile.image;
    }

    const savedUser = await this.userRepo.save(user);

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
