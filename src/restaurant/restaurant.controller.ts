import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Param,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  RestaurantLoginDto,
  CreateMenuDto,
  MenuQueryDto,
} from './restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { ResponseInterceptor } from '../util/response';
import { Public } from '../common/decorators/auth-skip.decorator';
import { Role } from '../common/decorators/role.decorator';

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

  @Role('restaurant')
  @Post('menu')
  async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.restaurantService.createMenu(createMenuDto);
  }

  @Get('menus')
  @Role('restaurant')
  @UsePipes(new ValidationPipe({ transform: true })) //QueryDto 자동 변환 & 유효성 검사 적용
  async getMenus(@Query() queryFiters: MenuQueryDto) {
    return this.restaurantService.getMenus(queryFiters);
  }

  @Delete('menu/:id')
  @Role('restaurant')
  async deleteMenu(@Param('id') id: number) {
    return this.restaurantService.deleteMenu(id);
  }
}
