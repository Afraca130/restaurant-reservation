import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>(
      ROLE_KEY,
      context.getHandler(),
    );

    if (!requiredRole) {
      return true; // 역할이 필요 없는 경우(예: 모든 사용자 접근 가능)
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);
    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRole}`,
      );
    }

    return true;
  }
}
