import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Put,
  Post,
  Delete,
  ParseIntPipe,
  Body,
  Param,
} from '@nestjs/common';

import { ProfilesService } from '../services/profiles.service';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dto';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { Profile } from '../entities/profile.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene todos los perfiles.' })
  @ApiOkResponse({
    description: 'Perfil encontrado',
    type: Profile,
  })
  @ApiNotFoundResponse({
    description: 'Perfil no encontrado',
  })
  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtiene una perfil en especifico.' })
  @ApiOkResponse({
    description: 'Perfil encontrado',
    type: Profile,
  })
  @ApiNotFoundResponse({
    description: 'Perfil no encontrado',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.findOne(id);
  }

  @ApiOperation({ summary: 'Crea un perfil.' })
  @ApiCreatedResponse({
    description: 'Perfil creado correctamente',
    type: Profile,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El perfil ya está registrado',
  })
  @Post()
  create(@Body() newProfile: CreateProfileDto) {
    return this.profileService.create(newProfile);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualiza un perfil.' })
  @ApiCreatedResponse({
    description: 'Perfil actualizado correctamente',
    type: Profile,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @ApiConflictResponse({
    description: 'El perfil ya está registrado',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedProfile: UpdateProfileDto,
  ) {
    return this.profileService.update(id, updatedProfile);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Elimina un perfil.' })
  @ApiOkResponse({
    description: 'Perfil borrado',
    type: Profile,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.remove(id);
  }
}
