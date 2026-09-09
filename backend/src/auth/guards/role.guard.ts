import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../users/models/user.role';

interface AuthenticatedUser {
  id: number;
  email: string;
  role: UserRole;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos para acceder al recurso desde los metadatos del controlador o del manejador de la ruta
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    // Si no hay roles requeridos, permitimos el acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtenemos el usuario autenticado desde la solicitud
    const request = context.switchToHttp().getRequest<{
      user: AuthenticatedUser;
    }>();

    const user = request.user;

    // Si no hay usuario autenticado, denegamos el acceso
    if (!user) {
      return false;
    }

    // Verificamos si el rol del usuario autenticado está incluido en los roles requeridos
    return requiredRoles.includes(user.role);
  }
}
