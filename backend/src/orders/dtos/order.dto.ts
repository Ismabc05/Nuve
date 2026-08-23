import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsPositive()
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  total!: number;
}

export class UdateOrderDto extends PartialType(CreateOrderDto) {}
