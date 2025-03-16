import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { restaurants, customers } from '../common/data/dummy-data';
import { UserForm } from '../common/data/dummy-data.forms';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async validateUser(
    id: string,
    password: string,
    role: string,
  ): Promise<UserForm> {
    const users = role === 'restaurant' ? restaurants : customers;

    const user = users.find((user) => user.id === id);

    // 사용자 확인
    if (!user) throw new NotFoundException('사용자가 없습니다');

    // 비밀번호 확인
    if (user.password !== password) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    const { password: _, ...result } = user;
    return { ...result, role };
  }

  async login(id: string, password: string, role: string) {
    const user = await this.validateUser(id, password, role);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserForm = { id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
