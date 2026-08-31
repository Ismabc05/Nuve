import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPositive, IsInt, Min } from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    example: 'M',
    description: 'talla del producto',
  })
  @IsNotEmpty()
  @IsString()
  size!: string;

  @ApiProperty({
    example: 'rojo',
    description: 'color del producto',
  })
  @IsNotEmpty()
  @IsString()
  color!: string;

  @ApiProperty({
    example: 10,
    description: 'stock del producto',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock!: number;

  @ApiProperty({
    example: 1,
    description: 'Id del producto',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId!: number;
}

export class UpdateProductVariantDto extends PartialType(
  CreateProductVariantDto,
) {}
