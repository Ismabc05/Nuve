import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductVariantDto {
  @IsNotEmpty()
  @IsString()
  size!: string;

  @IsNotEmpty()
  @IsString()
  color!: string;

  @IsNotEmpty()
  @IsNumber()
  stock!: number;

  @IsNotEmpty()
  @IsNumber()
  productId!: number;
}

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {}
