import { Injectable } from '@nestjs/common';

import { User } from '../entities/user.entitiy';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      email: 'ismael',
      password: '123456',
    },
    {
      id: 2,
      email: 'nerea',
      password: '123456',
    },
  ];

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    const user = this.users.find((user) => user.id === id);
    return user;
  }

  create(user: CreateUserDto) {
    const newUser: User = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, updateUser: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUser,
    };
    return this.users[userIndex];
  }

  remove(id: number) {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return null;
    }
    return this.users.splice(userIndex, 1);
  }
}
