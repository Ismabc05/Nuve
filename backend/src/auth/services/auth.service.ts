import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { PayloadToken } from '../model/token.model';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
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

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user =
      await this.userService.findByEmailForPasswordReset(normalizedEmail);

    // No revelar si el correo existe.
    if (!user) {
      return {
        message:
          'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.',
      };
    }

    const token = randomBytes(32).toString('hex');

    const tokenHash = createHash('sha256').update(token).digest('hex');

    const frontendUrl = this.configService
      .getOrThrow<string>('FRONTEND_URL')
      .replace(/\/$/, '');

    const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.profile?.name ?? 'cliente',
      resetLink,
    );

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.userService.savePasswordResetToken(
      user.id,
      tokenHash,
      expiresAt,
    );

    // Aquí conectaremos el envío del correo.
    // No devuelvas el token en la respuesta HTTP en producción.

    return {
      message:
        'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Se busca por el hash del token y se valida la caducidad.
    const user = await this.userService.findByPasswordResetToken(tokenHash);

    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException(
        'El enlace de recuperación no es válido o ha caducado',
      );
    }

    await this.userService.resetPassword(user.id, newPassword);

    return {
      message: 'Contraseña actualizada correctamente',
    };
  }
}
