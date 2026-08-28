import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsPositive, IsInt, Min } from 'class-validator';

export class CreateProductVariantDto {
  @IsNotEmpty()
  @IsString()
  size!: string;

  @IsNotEmpty()
  @IsString()
  color!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock!: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId!: number;
}

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {}
