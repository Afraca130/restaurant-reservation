import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'role';
export const Role = (role: 'restaurant' | 'customer' | 'all') =>
  SetMetadata(ROLE_KEY, role);
