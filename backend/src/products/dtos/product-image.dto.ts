import { PartialType } from '@nestjs/mapped-types';
import { IsUrl, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductImageDto {
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @IsNotEmpty()
  @IsNumber()
  productId!: number;
}

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {}
