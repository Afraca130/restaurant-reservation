import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Menu } from '../entity/menu.entity';
import {
  RestaurantLoginDto,
  CreateMenuDto,
  MenuQueryDto,
} from './restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    private readonly authService: AuthService,
  ) {}

  async login(loginDto: RestaurantLoginDto) {
    try {
      const { id, password } = loginDto;
      const accessToken = await this.authService.login(
        id,
        password,
        'restaurant',
      );

      return { accessToken };
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createMenu(dto: CreateMenuDto) {
    try {
      const menu = this.menuRepository.create(dto);
      return await this.menuRepository.save(menu);
    } catch (error) {
      throw new HttpException(
        'Failed to create menu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMenus(queryFiters: MenuQueryDto) {
    try {
      const { name, minPrice, maxPrice, category } = queryFiters;
      const query = this.menuRepository.createQueryBuilder('menu');

      if (name) {
        query.andWhere('menu.name LIKE :name', { name: `%${name}%` });
      }
      if (minPrice) {
        query.andWhere('menu.price >= :minPrice', { minPrice });
      }
      if (maxPrice) {
        query.andWhere('menu.price <= :maxPrice', { maxPrice });
      }
      if (category) {
        query.andWhere('menu.category = :category', { category });
      }

      return await query.getMany();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch menus',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMenu(id: number) {
    try {
      // menu는 데이터 안전성을 필요로 하지 않기때문에 하드 delete
      const result = await this.menuRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('Menu not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Menu deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete menu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
