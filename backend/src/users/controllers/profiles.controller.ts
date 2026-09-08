import { Controller, UseGuards } from '@nestjs/common';
import {
  Get,
  Put,
  Post,
  Delete,
  ParseIntPipe,
  Body,
  Param,
  Request,
  ForbiddenException,
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
import { UserRole } from '../models/user.role';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/role.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Obtiene una perfil en especifico.' })
  @ApiOkResponse({
    description: 'Perfil encontrado',
    type: Profile,
  })
  @ApiNotFoundResponse({
    description: 'Perfil no encontrado',
  })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== id) {
      throw new ForbiddenException('No tienes permisos para ver este perfil');
    }
    return this.profileService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
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
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== id) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar este perfil',
      );
    }
    return this.profileService.update(id, updatedProfile);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Elimina un perfil.' })
  @ApiOkResponse({
    description: 'Perfil borrado',
    type: Profile,
  })
  @ApiBadRequestResponse({
    description: 'Datos enviados incorrectamente',
  })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { sub: number; role: UserRole } },
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.sub !== id) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar este perfil',
      );
    }
    return this.profileService.remove(id);
  }
}
