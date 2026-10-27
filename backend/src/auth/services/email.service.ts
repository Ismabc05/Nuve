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
    // Es una promesa ya que puede tardar un poco su funcionamiento
    try {
      // Envío de correo electronico
      await emailjs.send(
        this.configService.getOrThrow<string>('EMAILJS_SERVICE_ID'), // Recibe el id del servicio (servicio de correo)
        this.configService.getOrThrow<string>('EMAILJS_TEMPLATE_ID'), // Id de la plantilla (la plantilla de correo)
        // Las variables que tiene esa plantilla
        {
          email,
          name,
          reset_link: resetLink,
        },
        {
          // Las claves de autenticacion para poder enviar el correo de recuperacion
          publicKey:
            this.configService.getOrThrow<string>('EMAILJS_PUBLIC_KEY'),
          privateKey: this.configService.getOrThrow<string>(
            'EMAILJS_PRIVATE_KEY',
          ),
        },
      );
    } catch (error: unknown) {
      console.error('Error enviando email de recuperación:', error);

      throw new InternalServerErrorException(
        'No se pudo enviar el correo de recuperación',
      );
    }
  }
}
