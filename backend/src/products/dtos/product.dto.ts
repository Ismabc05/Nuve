import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsInt,
  ArrayNotEmpty,
  IsPositive,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Camiseta',
    description: 'nombre del producto',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 20,
    description: 'precio del producto',
  })
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price!: number;

  @ApiProperty({
    example: 'Camiseta basica negra nike',
    description: 'descripcion del producto',
  })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'cateogorías del producto',
  })
  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  categories!: number[];

  @ApiProperty({
    example: 1,
    description: 'marca del producto',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  brandId!: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
