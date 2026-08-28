import { PartialType } from '@nestjs/mapped-types';
import { IsUrl, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateProductImageDto {
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId!: number;
}

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {}
