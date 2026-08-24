import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from '../entities/profile.entity';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {}

  async findAll() {
    return await this.profileRepo.find();
  }

  async findOne(id: number) {
    const profile = await this.profileRepo.findOne({
      where: {
        id,
      },
    });
    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }
    return profile;
  }

  async create(body: CreateProfileDto) {
    const newProfile = this.profileRepo.create(body);
    const savedProfile = await this.profileRepo.save(newProfile);
    return savedProfile;
  }

  async update(id: number, body: UpdateProfileDto) {
    const profile = await this.findOne(id);
    const updatedProfile = this.profileRepo.merge(profile, body);
    const savedProfile = await this.profileRepo.save(updatedProfile);
    return savedProfile;
  }

  async remove(id: number) {
    const profile = await this.findOne(id);
    await this.profileRepo.remove(profile);
    return {
      message: 'Perfil borrado correctamente',
    };
  }
}
