import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as emailjs from '@emailjs/nodejs';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendPasswordResetEmail(
    email: string,
    name: string,
    resetLink: string,
  ): Promise<void> {
    try {
      await emailjs.send(
        this.configService.getOrThrow<string>('EMAILJS_SERVICE_ID'),
        this.configService.getOrThrow<string>('EMAILJS_TEMPLATE_ID'),
        {
          email,
          name,
          reset_link: resetLink,
        },
        {
          publicKey:
            this.configService.getOrThrow<string>('EMAILJS_PUBLIC_KEY'),
        },
      );
    } catch (error: unknown) {
      console.error('Error enviando email de recuperación:');

      if (error instanceof Error) {
        console.error('Nombre:', error.name);
        console.error('Mensaje:', error.message);
        console.error('Stack:', error.stack);
      } else if (typeof error === 'object' && error !== null) {
        console.error(
          'Detalles:',
          JSON.stringify(error, Object.getOwnPropertyNames(error)),
        );
      } else {
        console.error('Detalles:', error);
      }

      throw new InternalServerErrorException(
        'No se pudo enviar el correo de recuperación',
      );
    }
  }
}
