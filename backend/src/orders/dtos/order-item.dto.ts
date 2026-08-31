import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsInt } from 'class-validator';

export class CreateOrderItem {
  @ApiProperty({
    example: 2,
    description: 'cantidad del productos en la linea de pedido',
  })
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  quantity!: number;

  @ApiProperty({
    example: 1,
    description: 'id de la variante del producto',
  })
  @IsPositive()
  @IsNotEmpty()
  @IsInt()
  productvariantId!: number;

  @ApiProperty({
    example: 1,
    description: 'id del pedido',
  })
  @IsNotEmpty()
  @IsInt()
  orderId!: number;
}

export class UpdateOrderItemDto {
  @IsInt()
  @IsPositive()
  quantity!: number;
}
