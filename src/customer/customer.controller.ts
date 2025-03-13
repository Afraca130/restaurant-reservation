import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  CreateReservationDto,
  LoginCustomerDto,
  UpdateReservationDto,
} from './customer.dto';
import { Public } from '../common/decorators/auth-skip.decorator';
import { ResponseInterceptor } from '../util/response';
import { Role } from '../common/decorators/role.decorator';

@Controller('reservation')
@UseInterceptors(new ResponseInterceptor())
export class CustomerController {
  constructor(private readonly reservationService: CustomerService) {}

  @Public()
  @Post('customer-login')
  async login(@Body() loginDto: LoginCustomerDto) {
    return this.reservationService.login(loginDto);
  }

  @Post()
  @Role('customer')
  async createReservation(@Body() dto: CreateReservationDto) {
    this.reservationService.createReservation(dto);
  }

  // restaurant, customer 모두 접근 가능
  @Get()
  async findAllReservations(
    @Query('phone') phone?: string,
    @Query('date') date?: string,
    @Query('minPeople') minPeople?: number,
    @Query('menu') menuId?: number,
  ) {
    this.reservationService.findAllReservations({
      phone,
      date,
      minPeople,
      menuId,
    });
  }

  @Put(':id')
  @Role('customer')
  async updateReservation(
    @Param('id') id: string,
    @Body() dto: UpdateReservationDto,
  ) {
    return this.reservationService.updateReservation(id, dto);
  }

  @Delete(':id')
  @Role('customer')
  async removeReservation(@Param('id') id: string) {
    return this.reservationService.removeReservation(id);
  }
}
