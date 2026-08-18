import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
