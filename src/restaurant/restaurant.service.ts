import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Menu } from '../entity/menu.entity';
import {
  RestaurantLoginDto,
  CreateMenuDto,
  MenuQueryDto,
} from './restaurant.dto';
import { LoginResponseDto } from '../auth/response.dto';
import { validateRestaurantExists } from '../util/validator';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
    private readonly authService: AuthService,
  ) {}

  async login(loginDto: RestaurantLoginDto): Promise<LoginResponseDto> {
    const { id, password } = loginDto;
    const accessToken = await this.authService.login(
      id,
      password,
      'restaurant',
    );

    return { accessToken };
  }

  async createMenu(restaurantId: string, dto: CreateMenuDto): Promise<Menu> {
    // 레스토랑 존재 여부 확인
    validateRestaurantExists(restaurantId);
    try {
      const menu = this.menuRepository.create({ restaurantId, ...dto });
      return await this.menuRepository.save(menu);
    } catch (error) {
      throw new HttpException('Failed to create menu', HttpStatus.BAD_REQUEST);
    }
  }

  async getMenus(
    restaurantId: string,
    queryFiters: MenuQueryDto,
  ): Promise<Menu[]> {
    try {
      const { name, minPrice, maxPrice, category } = queryFiters;
      const query = this.menuRepository
        .createQueryBuilder('menu')
        .where('menu.restaurantId = :restaurantId', { restaurantId });

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
      throw new HttpException('Failed to fetch menus', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteMenu(restaurantId: string, menuId: string) {
    try {
      // 해당 레스토랑에 메뉴가 존재하는지 여부
      const existMenuBelongInRestaurant = await this.menuRepository.findOne({
        where: { id: menuId, restaurantId },
      });

      if (!existMenuBelongInRestaurant) {
        throw new HttpException('Menu not found', HttpStatus.NOT_FOUND);
      }

      // menu는 데이터 안전성을 필요로 하지 않기때문에 하드 delete
      await this.menuRepository.delete(menuId);

      return { message: 'Menu deleted successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        // 기존에 던진 예외는 그대로 전파
        throw error;
      }

      throw new HttpException('Failed to delete menu', HttpStatus.BAD_REQUEST);
    }
  }

  async getMenusByIds(menuIds: string[]): Promise<Menu[]> {
    try {
      const menus = await this.menuRepository.findBy({ id: In(menuIds) });

      return menus;
    } catch (error) {
      throw new HttpException('Failed to fetch menus', HttpStatus.BAD_REQUEST);
    }
  }
}
