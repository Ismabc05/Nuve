import { Controller } from '@nestjs/common';
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

@Controller('order-item')
export class OrderItemController {
  constructor(private orderItemService: OrderItemService) {}

  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.findOne(id);
  }

  @Post()
  create(@Body() newOrderItem: CreateOrderItem) {
    return this.orderItemService.create(newOrderItem);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderItem: UpdateOrderItemDto,
  ) {
    return this.orderItemService.update(id, updateOrderItem);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderItemService.remove(id);
  }
}
