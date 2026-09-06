import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../entities/user.entitiy';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderStatus } from '../../orders/models/order.status';
import * as argon2 from 'argon2';
import { Product } from '../../products/entities/product.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return await this.userRepo.find({
      relations: { profile: true },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: { profile: true, orders: true },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async getAddress(id: number) {
    const user = await this.findOne(id);

    if (!user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    if (!user.profile.addresses || user.profile.addresses.length === 0) {
      throw new NotFoundException('Direcciones no encontradas');
    }

    return user.profile.addresses;
  }

  async getFavorites(id: number) {
    const user = await this.findOne(id);

    if (!user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const favorites = user.profile.favorites ?? [];

    if (favorites.length === 0) {
      return [];
    }

    return await this.productRepo.find({
      where: {
        id: In(favorites),
      },
    });
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
    const {
      email,
      password,
      name,
      lastname,
      phone,
      addresses: address,
      favorites,
      zipCode,
      image,
    } = body;

    const hashPassword = await argon2.hash(password);

    const newUser = this.userRepo.create({
      email,
      password: hashPassword,

      profile: {
        name,
        lastname,
        phone,
        addresses: address,
        favorites,
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

  async createFavorite(id: number, productId: number) {
    const user = await this.findOne(id);

    if (!user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const favorites = user.profile.favorites ?? [];

    if (favorites.includes(productId)) {
      return {
        message: 'El producto ya está en favoritos',
        favorites,
      };
    }

    favorites.push(productId);

    user.profile.favorites = favorites;

    await this.userRepo.save(user);

    return {
      message: 'Producto añadido a favoritos',
      favorites,
    };
  }

  async createAddress(
    id: number,
    address: {
      name?: string;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
    },
  ) {
    const user = await this.findOne(id);

    if (!user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const addresses = user.profile.addresses ?? [];

    addresses.push(address);

    user.profile.addresses = addresses;

    await this.userRepo.save(user);

    return address;
  }

  async update(id: number, body: UpdateUserDto) {
    const user = await this.findOne(id);

    const {
      name,
      lastname,
      phone,
      addresses,
      favorites,
      zipCode,
      image,
      ...userData
    } = body;

    this.userRepo.merge(user, userData);

    if (user.profile) {
      user.profile.name = name ?? user.profile.name;
      user.profile.lastname = lastname ?? user.profile.lastname;
      user.profile.phone = phone ?? user.profile.phone;
      user.profile.addresses = addresses ?? user.profile.addresses;
      user.profile.favorites = favorites ?? user.profile.favorites;
      user.profile.zip_code = zipCode ?? user.profile.zip_code;
      user.profile.image = image ?? user.profile.image;
    }

    const savedUser = await this.userRepo.save(user);

    return savedUser;
  }

  async updateAddress(
    id: number,
    address: {
      name?: string;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
    },
  ) {
    const user = await this.findOne(id);

    if (!user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    if (!user.profile.addresses || user.profile.addresses.length === 0) {
      throw new NotFoundException('Direcciones no encontradas');
    }

    user.profile.addresses = {
      ...user.profile.addresses,

      ...address,
    };

    await this.userRepo.save(user);

    return user.profile.addresses;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return {
      message: 'User borrado correctamente',
    };
  }

  async removeAddress(id: number) {
    const user = await this.findOne(id);

    if (!user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    if (!user.profile.addresses || user.profile.addresses.length === 0) {
      throw new NotFoundException('Direcciones no encontradas');
    }

    user.profile.addresses = null;

    await this.userRepo.save(user);

    return {
      message: 'Dirección eliminada correctamente',
    };
  }

  async removeFavorite(id: number, productId: number) {
    const user = await this.findOne(id);

    if (!user.profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    const favorites = user.profile.favorites ?? [];

    if (!favorites.includes(productId)) {
      throw new NotFoundException('El producto no se encuentra en favoritos');
    }

    user.profile.favorites = favorites.filter(
      (favoriteId) => favoriteId !== productId,
    );

    await this.userRepo.save(user);

    return {
      message: 'Producto eliminado de favoritos',
      favorites: user.profile.favorites,
    };
  }
}
