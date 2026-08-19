import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  lastname!: string;

  @IsNumber()
  @IsOptional()
  phone!: number;

  @IsString()
  @IsOptional()
  address!: string;

  @IsOptional()
  @IsUrl()
  image!: string;

  @IsOptional()
  @IsNumber()
  zip_code!: number;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
