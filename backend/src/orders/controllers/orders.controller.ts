import { Controller, Post, UseGuards } from '@nestjs/common';
import {
  Get,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
  Request,
  ForbiddenException,
} from '@nestjs/common';

import { OrdersService } from '../services/orders.service';
import { UpdateOrderDto } from '../dtos/order.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Order } from '../entities/order.entity';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/models/user.role';
import { RolesGuard } from '../../auth/guards/role.guard';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene todos los pedidos.' })
  @ApiOkResponse({
    description: 'Pedido encontrado',
    type: Order,
  })
  @ApiNotFoundResponse({
    description: 'Pedido no encontrado',
  })
  @Get()
  findAll(@Request() req: { user: { sub: number; role: UserRole } }) {
    if (req.user.role === UserRole.ADMIN) {
      return this.orderService.findAll();
    }
    return this.orderService.findAll(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene un pedido en especifico.' })
  @ApiOkResponse({
    description: 'Pedido encontrado',
    type: Order,
  })
  @ApiNotFoundResponse({
    description: 'Pedido no encontrado',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    const order = await this.orderService.findOne(id);

    if (req.user.role !== UserRole.ADMIN && req.user.sub !== order.user.id) {
      throw new ForbiddenException('No tienes permisos para ver este pedido');
    }
    return order;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Crea una nueva orden vacía para un usuario.' })
  @ApiCreatedResponse({
    description: 'Orden creada correctamente',
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Post(':id/orders')
  async createOrder(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== id) {
      throw new ForbiddenException(
        'No tienes permisos para crear una orden para este usuario',
      );
    }
    return this.orderService.createOrder(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Actualiza un pedido.' })
  @ApiCreatedResponse({
    description: 'Pedido actualizado correctamente',
    type: Order,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El pedido ya está registrado',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrder: UpdateOrderDto,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    const order = await this.orderService.findOne(id);
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== order.user.id) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar este pedido',
      );
    }
    return this.orderService.update(id, updateOrder);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Borra un pedido.' })
  @ApiOkResponse({
    description: 'Pedido borrado',
    type: Order,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    const order = await this.orderService.findOne(id);
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== order.user.id) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este pedido',
      );
    }
    return this.orderService.remove(id);
  }
}
