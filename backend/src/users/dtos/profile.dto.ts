import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsOptional()
  phone?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsString()
  zip_code?: number;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
