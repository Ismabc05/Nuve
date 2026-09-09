import { SetMetadata } from '@nestjs/common';

import { UserRole } from '../../users/models/user.role';

export const ROLES_KEY = 'roles';

// Obtiene los roles de usuario y los establece como metadatos en el controlador o método donde se aplica el decorador.
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
