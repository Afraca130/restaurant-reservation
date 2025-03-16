import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Reservation } from '../entity/reservation.entity';
import {
  CreateReservationDto,
  LoginCustomerDto,
  UpdateReservationDto,
} from './customer.dto';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../auth/response.dto';
import {
  validateTimeRange,
  validatePeopleCount,
  validateOverlappingReservation,
  validateReservationExists,
  validateReservationOwnership,
} from '../util/validator';
import { UserForm } from '../common/data/dummy-data.forms';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly authService: AuthService,
  ) {}

  async login(loginDto: LoginCustomerDto): Promise<LoginResponseDto> {
    const { id, password } = loginDto;
    const accessToken = await this.authService.login(id, password, 'customer');

    return { accessToken };
  }

  async createReservation(
    customerId: string,
    dto: CreateReservationDto,
  ): Promise<Reservation> {
    try {
      // 1. 시간 범위 검증
      validateTimeRange(dto.startTime, dto.endTime);

      // 2. 인원수 검증
      validatePeopleCount(dto.peopleCount);

      // 3. 같은 식당 내 예약 시간이 겹치는지 확인
      await validateOverlappingReservation(
        this.reservationRepository,
        dto.restaurantId,
        dto.date,
        dto.startTime,
        dto.endTime,
      );

      // 예약 생성
      const reservation = this.reservationRepository.create({
        restaurantId: dto.restaurantId,
        customerId: customerId,
        date: dto.date,
        startTime: dto.startTime,
        endTime: dto.endTime,
        phone: dto.phone,
        peopleCount: dto.peopleCount,
        menus: dto.menuIds.map((id) => ({ id })),
      });

      return await this.reservationRepository.save(reservation);
    } catch (error) {
      if (error instanceof HttpException) {
        // 기존에 던진 예외는 그대로 전파
        throw error;
      }
      throw new HttpException(
        'Failed to create reservation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllReservations(
    user: UserForm,
    filters: {
      phone?: string;
      date?: string;
      minPeople?: number;
      menuId?: number;
    },
  ): Promise<Reservation[]> {
    try {
      const query = this.reservationRepository
        .createQueryBuilder('reservation')
        .leftJoinAndSelect('reservation.menus', 'menus');

      // 역할(role)에 따른 필터 적용
      const roleFilter =
        user.role === 'customer'
          ? { key: 'reservation.customerId', value: user.id }
          : { key: 'reservation.restaurantId', value: user.id };

      query.andWhere(`${roleFilter.key} = :id`, { id: roleFilter.value });

      // 동적 필터 적용 (값이 존재하는 경우만 추가)
      const filtersMap: Record<string, any> = {
        'reservation.phone LIKE :phone': filters.phone
          ? `%${filters.phone}%`
          : null,
        'reservation.date = :date': filters.date,
        'reservation.peopleCount >= :minPeople': filters.minPeople,
        'menus.id = :menuId': filters.menuId,
      };

      Object.entries(filtersMap).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          query.andWhere(key, { [key.split(' ')[1].replace(':', '')]: value });
        }
      });

      return await query.getMany();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch reservations',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateReservation(
    reservationId: string,
    customerId: string,
    dto: UpdateReservationDto,
  ): Promise<Reservation> {
    try {
      // 1. 예약이 존재하는지 확인
      const reservation = await validateReservationExists(
        this.reservationRepository,
        reservationId,
      );

      // 2. 본인 예약인지 확인
      validateReservationOwnership(reservation, customerId);

      if (dto.peopleCount !== undefined) {
        await this.reservationRepository.update(reservationId, {
          peopleCount: dto.peopleCount,
        });
      }

      //`menus`는 Many-to-Many 관계이므로 `update()`가 아닌 `QueryBuilder` 사용
      if (dto.menuIds !== undefined) {
        await this.reservationRepository
          .createQueryBuilder()
          .relation(Reservation, 'menus')
          .of(reservationId)
          .addAndRemove(
            dto.menuIds,
            reservation.menus.map((menu) => menu.id),
          );
      }

      return await this.reservationRepository.findOne({
        where: { id: reservationId },
        relations: ['menus'],
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to update reservation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeReservation(id: string) {
    try {
      const reservation = await this.reservationRepository.findOne({
        where: { id },
      });

      if (!reservation) {
        throw new HttpException(
          '예약을 찾을 수 없습니다.',
          HttpStatus.NOT_FOUND,
        );
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
    } catch (error) {
      throw new HttpException(
        'Failed to delete reservation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
