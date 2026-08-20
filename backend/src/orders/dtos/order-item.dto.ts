import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderItem {
  @IsNotEmpty()
  @IsNumber()
  quantity!: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice!: number;
}

export class UpdateOrderItemDto extends PartialType(CreateOrderItem) {}
