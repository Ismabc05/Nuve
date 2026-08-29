import { IsNotEmpty, IsPositive, IsInt } from 'class-validator';

export class CreateOrderItem {
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  productvariantId!: number;

  @IsNotEmpty()
  @IsInt()
  orderId!: number;
}

export class UpdateOrderItemDto {
  @IsInt()
  @IsPositive()
  quantity!: number;
}
