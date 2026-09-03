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

@UseGuards(JwtAuthGuard)
@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @ApiOperation({ summary: 'Obtiene todas las lineas de pedido.' })
  @ApiOkResponse({
    description: 'Linea de pedido encontrado',
    type: OrderItem,
  })
  @ApiNotFoundResponse({
    description: 'Linea de pedido no encontrado',
  })
  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene una linea de pedido especifica.' })
  @ApiOkResponse({
    description: 'Linea de pedido encontrado',
    type: OrderItem,
  })
  @ApiNotFoundResponse({
    description: 'Linea de pedido no encontrado',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.findOne(id);
  }

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
  create(@Body() newOrderItem: CreateOrderItem) {
    return this.orderItemService.create(newOrderItem);
  }

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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItem: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(id, updateOrderItem);
  }

  @ApiOperation({ summary: 'Borra una linea de pedido.' })
  @ApiOkResponse({
    description: 'Linea de pedido borrada',
    type: OrderItem,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.remove(id);
  }
}
