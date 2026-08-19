import { Controller } from '@nestjs/common';
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

@Controller('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.findOne(id);
  }

  @Post()
  create(@Body() newProfile: CreateProfileDto) {
    return this.profileService.create(newProfile);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedProfile: UpdateProfileDto,
  ) {
    return this.profileService.update(id, updatedProfile);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.remove(id);
  }
}
