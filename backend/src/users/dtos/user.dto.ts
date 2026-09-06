import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'juan@gmail.com',
    description: 'Email del usuario',
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    example: 'García',
    description: 'Apellidos del usuario',
  })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiPropertyOptional({
    example: '621056585',
    description: 'Telefono del usuario',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    example: [
      {
        name: 'Casa',
        street: 'Calle Cruz del Estudiante',
        city: 'Puente Genil',
        state: 'Córdoba',
        country: 'España',
      },
      {
        name: 'Trabajo',
        street: 'Avenida Andalucía',
        city: 'Málaga',
        state: 'Málaga',
        country: 'España',
      },
    ],
    description: 'Direcciones del perfil',
  })
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

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'IDs de los productos favoritos del usuario',
  })
  @IsOptional()
  @IsArray()
  favorites?: number[];

  @ApiPropertyOptional({
    example: '14500',
    description: 'Código postal del usuario',
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/juan.jpg',
    description: 'Imagen del usuario',
  })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
