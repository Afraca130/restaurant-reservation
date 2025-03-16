import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import {
  CreateReservationDto,
  LoginCustomerDto,
  UpdateReservationDto,
} from './customer.dto';
import { Public } from '../common/decorators/auth-skip.decorator';
import { ResponseInterceptor } from '../util/response';
import { Role } from '../common/decorators/role.decorator';
import { LoginResponseDto } from '../auth/response.dto';
import { Reservation } from '../entity/reservation.entity';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserForm } from '../common/data/dummy-data.forms';

@ApiTags('Reservation')
@Controller('reservation')
@UseInterceptors(new ResponseInterceptor())
export class CustomerController {
  constructor(private readonly reservationService: CustomerService) {}

  @Public()
  @Post('customer-login')
  @ApiOperation({ summary: '고객 로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청 or 비밀번호 불일치' })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 404, description: '사용자가 확인 실패' })
  @ApiBody({ type: LoginCustomerDto })
  async login(@Body() loginDto: LoginCustomerDto): Promise<LoginResponseDto> {
    return this.reservationService.login(loginDto);
  }

  @Post()
  @Role('customer')
  @ApiOperation({ summary: '예약 생성' })
  @ApiResponse({
    status: 201,
    description: '예약 생성 성공',
    type: Reservation,
  })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiBody({ type: CreateReservationDto })
  async createReservation(
    @GetUser() user: UserForm,
    @Body() dto: CreateReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.createReservation(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: '예약 목록 조회' })
  @ApiResponse({ status: 200, description: '조회 성공', type: [Reservation] })
  @ApiQuery({ name: 'phone', required: false })
  @ApiQuery({ name: 'date', required: false })
  @ApiQuery({ name: 'minPeople', required: false, type: Number })
  @ApiQuery({ name: 'menu', required: false, type: Number })
  async findAllReservations(
    @GetUser() user: UserForm,
    @Query('phone') phone?: string,
    @Query('date') date?: string,
    @Query('minPeople') minPeople?: number,
    @Query('menu') menuId?: number,
  ): Promise<Reservation[]> {
    return this.reservationService.findAllReservations(user, {
      phone,
      date,
      minPeople,
      menuId,
    });
  }

  @Patch(':id')
  @Role('customer')
  @ApiOperation({ summary: '예약 수정' })
  @ApiResponse({ status: 200, description: '수정 성공', type: Reservation })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 403, description: '본인만 수정 가능' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없음' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateReservationDto })
  async updateReservation(
    @Param('id') reservationId: string,
    @GetUser() user: UserForm,
    @Body() dto: UpdateReservationDto,
  ): Promise<Reservation> {
    return this.reservationService.updateReservation(
      reservationId,
      user.id,
      dto,
    );
  }

  @Delete(':id')
  @Role('customer')
  @ApiOperation({ summary: '예약 삭제' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '예약을 찾을 수 없음' })
  @ApiParam({ name: 'id', type: String })
  async removeReservation(@Param('id') id: string) {
    return this.reservationService.removeReservation(id);
  }
}
