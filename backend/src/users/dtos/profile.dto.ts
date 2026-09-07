import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUrl,
  IsArray,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del perfil',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'García',
    description: 'Apellidos del perfil',
  })
  @IsString()
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({
    example: '654343212',
    description: 'Telefono del perfil',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsArray()
  addresses?: {
    id: number;
    name?: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  }[];

  @IsOptional()
  @IsArray()
  favorites?: number[];

  @ApiPropertyOptional({
    example: 'https://example.com/juan.jpg',
    description: 'Imagen del perfil',
  })
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional({
    example: '14500',
    description: 'Código postal del perfil',
  })
  @IsOptional()
  @IsString()
  zip_code?: string;
}

export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
