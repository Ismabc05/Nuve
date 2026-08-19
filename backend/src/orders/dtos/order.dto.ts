import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsNumber()
  total!: number;
}

export class UdateOrderDto extends PartialType(CreateOrderDto) {}
