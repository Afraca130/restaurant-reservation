import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt'; // JWT 토큰 해석을 위해 필요
import { ROLE_KEY } from '../decorators/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLE_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // 역할 제한이 없는 경우 접근 허용
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ForbiddenException('No valid token provided.');
    }

    // JWT 토큰에서 사용자 정보 추출
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = this.jwtService.verify(token); // JWT 해석
    } catch (error) {
      throw new ForbiddenException('Invalid or expired token.');
    }

    const userRole = decodedToken.role; // 사용자 역할 추출
    request.user = decodedToken; // `request.user`에 유저 정보 저장

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        `Access denied. Required role: ${requiredRoles}`,
      );
    }

    return true;
  }
}
