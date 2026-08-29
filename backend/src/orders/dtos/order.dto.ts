import { IsEnum } from 'class-validator';
import { OrderStatus } from '../models/order.status';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
