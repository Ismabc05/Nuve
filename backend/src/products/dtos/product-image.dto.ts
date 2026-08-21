import { PartialType } from '@nestjs/mapped-types';
import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateProductImageDto {
  @IsUrl()
  @IsNotEmpty()
  url!: string;
}

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {}
