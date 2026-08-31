import { IsEnum } from 'class-validator';
import { OrderStatus } from '../models/order.status';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'ACTIVE',
    description: 'estado del pedido',
  })
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
