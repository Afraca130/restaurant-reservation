import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  private restaurants = [
    { id: 'restaurant1', password: 'password123' },
    { id: 'restaurant2', password: 'password123' },
  ];

  private customers = [
    { id: 'customer1', password: 'password123' },
    { id: 'customer2', password: 'password123' },
    { id: 'customer3', password: 'password123' },
  ];

  async validateUser(id: string, password: string, role: string) {
    const users = role === 'restaurant' ? this.restaurants : this.customers;

    const user = users.find((user) => user.id === id);

    // 사용자 확인
    if (!user) throw new NotFoundException('사용자가 없습니다');

    // 비밀번호 확인
    if (user && user.password !== password) {
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

    const payload = { id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
