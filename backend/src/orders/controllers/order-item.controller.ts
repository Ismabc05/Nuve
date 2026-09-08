import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Request,
  ForbiddenException,
} from '@nestjs/common';

import { OrderItemService } from '../services/order-item.service';
import { CreateOrderItem, UpdateOrderItemDto } from '../dtos/order-item.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { OrderItem } from '../entities/order-item.entity';

import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../users/models/user.role';
import { RolesGuard } from '../../auth/guards/role.guard';
import { OrdersService } from '../services/orders.service';

@Controller('order-item')
export class OrderItemController {
  constructor(
    private orderItemService: OrderItemService,
    private orderService: OrdersService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene todas las lineas de pedido.' })
  @ApiOkResponse({
    description: 'Linea de pedido encontrado',
    type: OrderItem,
  })
  @ApiNotFoundResponse({
    description: 'Linea de pedido no encontrado',
  })
  @Get()
  findAll(@Request() req: { user: { sub: number; role: UserRole } }) {
    if (req.user.role === UserRole.ADMIN) {
      return this.orderItemService.findAll();
    }
    return this.orderItemService.findAll(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene una linea de pedido especifica.' })
  @ApiOkResponse({
    description: 'Linea de pedido encontrado',
    type: OrderItem,
  })
  @ApiNotFoundResponse({
    description: 'Linea de pedido no encontrado',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    const orderItem = await this.orderItemService.findOne(id);
    if (
      req.user.role === UserRole.USER &&
      orderItem.order.user.id !== req.user.sub
    ) {
      throw new ForbiddenException(
        'No tienes permiso para acceder a este recurso',
      );
    }
    return orderItem;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Crea una linea de pedido.' })
  @ApiCreatedResponse({
    description: 'Linea de pedido creado correctamente',
    type: OrderItem,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La linea de pedido ya está registrado',
  })
  @Post()
  async create(
    @Body() newOrderItem: CreateOrderItem,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    const order = await this.orderService.findOne(newOrderItem.orderId);
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== order.user.id) {
      throw new ForbiddenException(
        'No tienes permisos para añadir una linea a este pedido',
      );
    }
    return this.orderItemService.create(newOrderItem);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Actualiza una linea de pedido.' })
  @ApiCreatedResponse({
    description: 'Linea de pedido actualizado correctamente',
    type: OrderItem,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'La linea de pedido ya está registrado',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItem: UpdateOrderItemDto,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    const orderItem = await this.orderItemService.findOne(id);
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.sub !== orderItem.order.user.id
    ) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar esta linea de pedido',
      );
    }
    return this.orderItemService.update(id, updateOrderItem);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Borra una linea de pedido.' })
  @ApiOkResponse({
    description: 'Linea de pedido borrada',
    type: OrderItem,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    const orderItem = await this.orderItemService.findOne(id);
    if (
      req.user.role !== UserRole.ADMIN &&
      req.user.sub !== orderItem.order.user.id
    ) {
      throw new ForbiddenException(
        'No tienes permisos para borrar esta linea de pedido',
      );
    }
    return this.orderItemService.remove(id);
  }
}
