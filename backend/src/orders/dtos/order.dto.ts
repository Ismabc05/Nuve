import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { OrderStatus } from '../models/order.status';

export class UpdateOrderDto {
  @ApiProperty({
    example: 'ACTIVE',
    description: 'estado del pedido',
  })
  @IsEnum(OrderStatus)
  status!: OrderStatus;
}
