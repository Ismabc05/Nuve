import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../entities/user.entitiy';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async create(body: CreateUserDto) {
    const newUser = this.userRepo.create(body);
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
