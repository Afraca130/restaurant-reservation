import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const Role = (role: 'restaurant' | 'customer') =>
  SetMetadata(ROLE_KEY, role);
