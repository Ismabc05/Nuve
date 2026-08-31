import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Dior',
    description: 'Nombre de la marca',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
