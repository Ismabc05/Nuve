import { IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Chanclas',
    description: 'Nombre de la categoría',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
