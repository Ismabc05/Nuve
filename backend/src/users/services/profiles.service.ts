import { Injectable } from '@nestjs/common';

import { Profile } from '../entities/profile.entity';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dto';

@Injectable()
export class ProfilesService {
  private profiles: Profile[] = [
    {
      id: 1,
      name: 'ismael',
      lastname: 'bedmar',
      phone: 4767675,
      address: 'calle tintor',
      image: 'https://example.com/laptop.jpg',
      zip_code: 14500,
    },
    {
      id: 2,
      name: 'nerea',
      lastname: 'bedmar',
      phone: 4767675,
      address: 'calle tintor',
      image: 'https://example.com/laptop.jpg',
      zip_code: 14500,
    },
  ];

  findAll() {
    return this.profiles;
  }

  findOne(id: number) {
    const profile = this.profiles.find((profile) => profile.id === id);
    return profile;
  }

  create(newProfile: CreateProfileDto) {
    const profile: Profile = {
      id: this.profiles.length + 1,
      ...newProfile,
    };
    this.profiles.push(profile);
    return profile;
  }

  update(id: number, updatedProfile: UpdateProfileDto) {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.id === id,
    );
    if (profileIndex === -1) {
      return null;
    }

    this.profiles[profileIndex] = {
      ...this.profiles[profileIndex],
      ...updatedProfile,
    };

    return this.profiles[profileIndex];
  }

  remove(id: number) {
    const profileIndex = this.profiles.findIndex(
      (profile) => profile.id === id,
    );
    if (profileIndex === -1) {
      return null;
    }
    return this.profiles.splice(profileIndex, 1);
  }
}
