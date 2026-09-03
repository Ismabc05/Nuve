import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from '../model/token.model';
import { User } from '../../users/entities/user.entitiy';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id }; // sacamos lo que queremos que esté dentro el token
    return {
      access_token: this.jwtService.sign(payload), // creamos y firmamos el token con ese payload
      user,
    };
  }
}
