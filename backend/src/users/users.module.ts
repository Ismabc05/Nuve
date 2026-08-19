import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { ProfilesController } from './controllers/profiles.controller';
import { ProfilesService } from './services/profiles.service';

@Module({
  controllers: [UsersController, ProfilesController],
  providers: [UsersService, ProfilesService],
})
export class UsersModule {}
