import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateOrderItem {
  @IsPositive()
  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsPositive()
  @IsNotEmpty()
  productvariantId!: number;

  @IsNotEmpty()
  @IsNumber()
  orderId!: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItem) {}
