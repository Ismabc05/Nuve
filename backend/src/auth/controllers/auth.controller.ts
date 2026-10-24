import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { User } from '../../users/entities/user.entity';
import { ForgotPasswordDto } from '../dtos/forgot-password-dto';
import { ResetPasswordDto } from '../dtos/reset-password-dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiOperation({ summary: 'Inicia sesión y obtiene un token JWT.' })
  @ApiOkResponse({
    description: 'Inicio de sesión exitoso',
    type: String,
  })
  @ApiNotFoundResponse({
    description: 'Usuario no encontrado',
  })
  @ApiBody({
    schema: {
      example: {
        email: 'usuario@ejemplo.com',
        password: 'Password123!',
      },
    },
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }
}
