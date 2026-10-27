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
    // Guardamos el email sin espacios y sin mayusculas
    const normalizedEmail = email.trim().toLowerCase();

    // Busca el usuario que contenga ese email
    const user =
      await this.userService.findByEmailForPasswordReset(normalizedEmail);

    // No revelar si el correo existe.
    if (!user) {
      return {
        message:
          'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.',
      };
    }

    // Crea un token de 65 bits aleatorios
    const token = randomBytes(32).toString('hex');

    // Hasehamos el token para que no sepa cual es
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Generamos una url incluido el token para que el usuario pueda cambiar su contraseña

    // Obtenemos la url del frontend
    const frontendUrl = this.configService
      .getOrThrow<string>('FRONTEND_URL')
      .replace(/\/$/, '');

    const resetLink = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;

    // Así seria la url final https://miweb.com/reset-password?token=abc123...

    // Llamamos al metodo que envia el correoi de recuperacion
    await this.emailService.sendPasswordResetEmail(
      user.email,
      user.profile?.name ?? 'cliente',
      resetLink,
    );

    // Creamos una fecha de expiracion de 15 minutos
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // LLamamos al metodo que guarda el token y la fecha del usuario en la base de datos
    await this.userService.savePasswordResetToken(
      user.id,
      tokenHash,
      expiresAt,
    );

    return {
      message:
        'Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña.',
    };
  }

  async resetPassword(token: string, newPassword: string) {
    // Hasheamos el token por seguridad
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // LLamos al metodo que buscar el usuario mediante el token hasheado
    const user = await this.userService.findByPasswordResetToken(tokenHash);

    // Validamos que el usuario exista, que existe una fecha de expiracion y que no esté caducada
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() <= Date.now()
    ) {
      throw new UnauthorizedException(
        'El enlace de recuperación no es válido o ha caducado',
      );
    }

    // Llamamos al metodo que actualiza la contraseña del usuario
    await this.userService.resetPassword(user.id, newPassword);

    return {
      message: 'Contraseña actualizada correctamente',
    };
  }
}
