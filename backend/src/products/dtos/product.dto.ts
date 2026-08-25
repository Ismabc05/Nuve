import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  IsInt,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  categories!: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
