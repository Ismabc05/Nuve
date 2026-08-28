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

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @ArrayNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  categories!: number[];

  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  brandId!: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
