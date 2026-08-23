import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfilesService } from './services/profiles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entitiy';
import { Profile } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController, ProfilesController],
  providers: [UsersService, ProfilesService],
})
export class UsersModule {}
