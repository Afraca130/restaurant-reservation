import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserForm } from '../data/dummy-data.forms';

// 요청의 JWT 토큰에서 (customer or restaurant)Id를 추출하는 데코레이터
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserForm => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserForm = request.user;

    if (!user || !user.id) {
      throw new Error(`${user.role}Id를 찾을 수 없습니다.`);
    }

    return user;
  },
);
