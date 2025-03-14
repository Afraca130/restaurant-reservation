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
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import {
  RestaurantLoginDto,
  CreateMenuDto,
  MenuQueryDto,
} from './restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { ResponseInterceptor } from '../util/response';
import { Public } from '../common/decorators/auth-skip.decorator';
import { Role } from '../common/decorators/role.decorator';
import { LoginResponseDto } from '../auth/response.dto';
import { Menu } from '../entity/menu.entity';

@ApiTags('Restaurant')
@Controller('restaurant')
@UseInterceptors(new ResponseInterceptor())
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Restaurant 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiBody({ type: RestaurantLoginDto })
  async login(@Body() loginDto: RestaurantLoginDto): Promise<LoginResponseDto> {
    return this.restaurantService.login(loginDto);
  }

  @Role('restaurant')
  @Post('menu')
  @ApiOperation({ summary: '메뉴 추가' })
  @ApiResponse({ status: 201, description: '메뉴 생성 성공', type: Menu })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiBody({ type: CreateMenuDto })
  async createMenu(@Body() createMenuDto: CreateMenuDto): Promise<Menu> {
    return this.restaurantService.createMenu(createMenuDto);
  }

  @Get('menus')
  @Role('restaurant')
  @UsePipes(new ValidationPipe({ transform: true })) // QueryDto 자동 변환 & 유효성 검사 적용
  @ApiOperation({ summary: '메뉴 목록 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: [Menu] })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false })
  async getMenus(@Query() queryFilters: MenuQueryDto): Promise<Menu[]> {
    return this.restaurantService.getMenus(queryFilters);
  }

  @Delete('menu/:id')
  @Role('restaurant')
  @ApiOperation({ summary: '메뉴 삭제' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '메뉴를 찾을 수 없음' })
  @ApiParam({ name: 'id', type: Number })
  async deleteMenu(@Param('id') id: number) {
    return this.restaurantService.deleteMenu(id);
  }
}
