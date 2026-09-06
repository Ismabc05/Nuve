import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Clothing Store API')
    .setDescription(
      'API RESTful desarrollada con NestJS para ofrecer una solución completa de gestión ' +
        'para tiendas de ropa. El sistema incluye funcionalidades para la administración de ' +
        'productos, usuarios, pedidos, categorías y marcas, así como mecanismos seguros de ' +
        'autenticación y autorización.',
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
