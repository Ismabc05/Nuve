import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    example: 'Imagen del producto',
    description: 'https://example.com/juan.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @ApiProperty({
    example: 1,
    description: 'Id del producto',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  productId!: number;
}

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {}
