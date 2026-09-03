import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { User } from '../entities/user.entitiy';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene todos los usuarios.' })
  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene un usuario en especifico.' })
  @ApiOkResponse({
    description: 'Usuario encontrado',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea un usuario.' })
  @ApiCreatedResponse({
    description: 'Usuario creado correctamente',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El usuario ya está registrado',
  })
  @Post()
  create(@Body() newUser: CreateUserDto) {
    return this.userService.create(newUser);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualiza un usuario.' })
  @Put(':id')
  @ApiCreatedResponse({
    description: 'Usuario actualizado correctamente',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El usuario ya está registrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedUser: UpdateUserDto,
  ) {
    return this.userService.update(id, updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Elimina un usuario.' })
  @ApiOkResponse({
    description: 'Usuario borrado',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
