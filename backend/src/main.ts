import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Clothing Store API')
    .setDescription(
      'API RESTful desarrollada con NestJS y TypeScript para la gestión integral de una tienda de ropa online. ' +
        'La aplicación proporciona una arquitectura backend orientada a la gestión de usuarios, perfiles, productos, ' +
        'variantes, imágenes, categorías, marcas, pedidos y líneas de pedido. ' +
        'El sistema implementa autenticación y autorización mediante JWT y Passport, permitiendo controlar el acceso ' +
        'a los diferentes recursos en función del rol del usuario (ADMIN o USER) y de la propiedad de los recursos. ' +
        'Los usuarios pueden gestionar sus propios perfiles y pedidos, mientras que los administradores disponen de ' +
        'permisos adicionales para administrar los recursos generales de la aplicación. ' +
        'La API incluye validación de datos mediante DTOs y class-validator, persistencia de datos mediante TypeORM ' +
        'y PostgreSQL, y gestión de la estructura de la base de datos mediante migraciones. ' +
        'Además, se han incorporado medidas de seguridad como Helmet y configuración de CORS, dejando la aplicación ' +
        'preparada para su despliegue en entornos de producción. ' +
        'Esta documentación permite consultar y probar de forma interactiva los diferentes endpoints disponibles, ' +
        'incluyendo sus parámetros, cuerpos de petición, respuestas y mecanismos de autenticación.',
    )
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas en los DTOs
      transformOptions: {
        enableImplicitConversion: true, // Permite la conversión implícita de tipos, por ejemplo, de string a number usando PaerseIntPipe o ParseFloatPipe
      },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector))); // Se usa junta a @Exclude() para ocultar propiedades de la respuesta

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
