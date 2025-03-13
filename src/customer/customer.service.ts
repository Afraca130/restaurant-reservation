import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entity/reservation.entity';
import {
  CreateReservationDto,
  LoginCustomerDto,
  UpdateReservationDto,
} from './customer.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly authService: AuthService,
  ) {}

  async login(loginDto: LoginCustomerDto) {
    const { id, password } = loginDto;
    console.log(loginDto);

    const accessToken = await this.authService.login(id, password, 'customer');

    return { accessToken };
  }

  async createReservation(dto: CreateReservationDto) {
    // 예약 중복 검증 (같은 식당, 같은 시간대 예약 방지)
    const existingCustomer = await this.reservationRepository.findOne({
      where: {
        restaurantId: dto.restaurantId,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
      },
    });

    if (existingCustomer) {
      throw new HttpException(
        '이미 해당 시간에 예약이 존재합니다.',
        HttpStatus.CONFLICT,
      );
    }

    // 예약 생성
    const reservation = this.reservationRepository.create({
      restaurantId: dto.restaurantId,
      customerId: dto.customerId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      phone: dto.phone,
      peopleCount: dto.peopleCount,
      menus: dto.menuIds.map((id) => ({ id })),
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAllReservations(filters: {
    phone?: string;
    date?: string;
    minPeople?: number;
    menuId?: number;
  }) {
    const { phone, date, minPeople, menuId } = filters;
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.customer', 'customer')
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.menus', 'menus');

    if (phone) {
      query.andWhere('reservation.phone LIKE :phone', { phone: `%${phone}%` });
    }
    if (date) {
      query.andWhere('reservation.date = :date', { date });
    }
    if (minPeople) {
      query.andWhere('reservation.peopleCount >= :minPeople', { minPeople });
    }
    if (menuId) {
      query.andWhere('menus.id = :menuId', { menuId });
    }

    return await query.getMany();
  }

  async updateReservation(id: string, dto: UpdateReservationDto) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new HttpException('예약을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    // 본인 예약인지 확인 (고객 ID 확인 필요)
    if (dto.customerId !== reservation.customerId) {
      throw new HttpException(
        '본인의 예약만 수정할 수 있습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.reservationRepository.update(id, {
      peopleCount: dto.peopleCount,
      menus: dto.menuIds.map((id) => ({ id })),
    });

    return await this.reservationRepository.findOne({ where: { id } });
  }

  async removeReservation(id: string) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    });

    if (!reservation) {
      throw new HttpException('예약을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    // 본인 예약인지 확인 (고객 ID 확인 필요)
    if (reservation.customerId !== reservation.customerId) {
      throw new HttpException(
        '본인의 예약만 삭제할 수 있습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    // 고객예약에 대해서는 softDelete로 데이터 안정성을 유지
    await this.reservationRepository.softDelete(id);
    return { deleted: true };
  }
}
