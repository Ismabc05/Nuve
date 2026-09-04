import { Controller, UseGuards } from '@nestjs/common';
import { Get, Put, Delete, Param, ParseIntPipe, Body } from '@nestjs/common';

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
  findAll() {
    return this.orderService.findAll();
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.findOne(id);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrder: UpdateOrderDto,
  ) {
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.remove(id);
  }
}
