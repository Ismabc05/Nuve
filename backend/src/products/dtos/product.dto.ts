import { IsString, IsNumber, IsNotEmpty, IsUrl } from 'class-validator';

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
  @IsNumber()
  stock!: number;

  @IsNotEmpty()
  @IsUrl()
  image!: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
