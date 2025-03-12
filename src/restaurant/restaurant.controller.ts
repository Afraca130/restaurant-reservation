import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantLoginDto, CreateMenuDto } from './restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { ResponseInterceptor } from '../util/response';
import { Public } from '../common/decorators/auth-skip.decorator';

@Controller('restaurant')
@UseInterceptors(new ResponseInterceptor())
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: RestaurantLoginDto) {
    console.log(loginDto);
    return this.restaurantService.login(loginDto);
  }

  @Post('menu')
  async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.restaurantService.createMenu(createMenuDto);
  }

  @Get('menus')
  async getMenus(
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    return this.restaurantService.getMenus({ name, minPrice, maxPrice });
  }

  @Delete('menu/:id')
  async deleteMenu(@Param('id') id: number) {
    return this.restaurantService.deleteMenu(id);
  }
}
