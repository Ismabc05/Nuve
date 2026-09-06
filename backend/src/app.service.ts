import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Bienvenido a la API RESTful de la tienda de ropa desarrollada con NestJS. Esta API proporciona una solución completa para la gestión de productos, usuarios, pedidos, categorías y marcas, así como mecanismos seguros de autenticación y autorización.';
  }
}
