import { IsNotEmpty, IsNumber, IsEnum, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { OrderStatus } from '../models/order.status';

export class CreateOrderDto {
  @IsPositive()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  total!: number;
}

// Actualizar
export class UdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
