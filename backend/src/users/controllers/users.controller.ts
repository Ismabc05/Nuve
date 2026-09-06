import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { User } from '../entities/user.entitiy';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { UserRole } from '../models/user.role';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/role.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtiene todos los usuarios.' })
  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene un usuario en especifico.' })
  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene la dirección de un usuario.' })
  @ApiOkResponse({
    description: 'Dirección encontrada',
  })
  @ApiNotFoundResponse({
    description: 'Dirección no encontrada',
  })
  @Get(':id/address')
  getAddress(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getAddress(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene los productos favoritos de un usuario.' })
  @ApiOkResponse({
    description: 'Productos favoritos encontrados',
  })
  @ApiNotFoundResponse({
    description: 'Productos favoritos no encontrados',
  })
  @Get(':id/favorites')
  getFavorites(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getFavorites(id);
  }

  @ApiOperation({ summary: 'Crea un usuario.' })
  @ApiCreatedResponse({
    description: 'Usuario creado correctamente',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El usuario ya está registrado',
  })
  @Post()
  create(@Body() newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Añade un producto a los favoritos de un usuario.' })
  @ApiCreatedResponse({
    description: 'Producto añadido a favoritos',
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Post(':id/favorites/:productId')
  createFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.userService.createFavorite(id, productId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Crea una dirección para un usuario.' })
  @ApiCreatedResponse({
    description: 'Dirección creada correctamente',
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Post(':id/address')
  createAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    address: {
      name?: string;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
    },
  ) {
    return this.userService.createAddress(id, address);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Actualiza un usuario.' })
  @Put(':id')
  @ApiCreatedResponse({
    description: 'Usuario actualizado correctamente',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El usuario ya está registrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUser: UpdateUserDto,
  ) {
    return this.userService.update(id, updatedUser);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Actualiza una dirección de un usuario.' })
  @ApiOkResponse({
    description: 'Dirección actualizada correctamente',
  })
  @ApiNotFoundResponse({
    description: 'Usuario o dirección no encontrada',
  })
  @Put(':id/addresses/:addressId')
  updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body()
    address: {
      name?: string;
      street?: string;
      city?: string;
      state?: string;
      country?: string;
    },
  ) {
    return this.userService.updateAddress(id, addressId, address);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Elimina un usuario.' })
  @ApiOkResponse({
    description: 'Usuario borrado',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Elimina una dirección de un usuario.' })
  @ApiOkResponse({
    description: 'Dirección borrada',
  })
  @ApiNotFoundResponse({
    description: 'Usuario o dirección no encontrada',
  })
  @Delete(':id/addresses/:addressId')
  removeAddress(
    @Param('id', ParseIntPipe) id: number,
    @Param('addressId', ParseIntPipe) addressId: number,
  ) {
    return this.userService.removeAddress(id, addressId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({
    summary: 'Elimina un producto de los favoritos de un usuario.',
  })
  @ApiOkResponse({
    description: 'Producto eliminado de favoritos',
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Delete(':id/favorites/:productId')
  removeFavorite(
    @Param('id', ParseIntPipe) id: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.userService.removeFavorite(id, productId);
  }
}
