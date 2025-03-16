import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Reservation } from '../entity/reservation.entity';
import { Menu } from '../entity/menu.entity';
import { restaurants } from '../common/data/dummy-data';

// 시간 범위가 검증
export const validateTimeRange = (startTime: string, endTime: string): void => {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
    throw new HttpException(
      '시간 형식이 올바르지 않습니다. (예: HH:mm)',
      HttpStatus.BAD_REQUEST,
    );
  }

  if (startTime >= endTime) {
    throw new HttpException(
      '시작 시간은 종료 시간보다 이전이어야 합니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
};

// 인원수가 1명 이상인지 확인
export const validatePeopleCount = (peopleCount: number): void => {
  if (peopleCount <= 0) {
    throw new HttpException(
      '예약 인원수는 1명 이상이어야 합니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
};

// 동일 시간대에 예약이 있는지 확인
export const validateOverlappingReservation = async (
  reservationRepository: Repository<Reservation>,
  restaurantId: string,
  date: string,
  startTime: string,
  endTime: string,
): Promise<void> => {
  const overlappingReservation = await reservationRepository.findOne({
    where: {
      restaurantId,
      date,
      startTime: LessThan(endTime),
      endTime: MoreThan(startTime),
    },
  });

  if (overlappingReservation) {
    throw new HttpException(
      '해당 시간대에 이미 예약이 존재합니다.',
      HttpStatus.CONFLICT,
    );
  }
};

// 특정 레스토랑의 메뉴인지 확인
export const validateMenuBelongsToRestaurant = async (
  menuRepository: Repository<Menu>,
  restaurantId: string,
  menuIds: number[],
): Promise<void> => {
  const menus = await menuRepository.findByIds(menuIds);

  if (menus.length !== menuIds.length) {
    throw new HttpException(
      '유효하지 않은 메뉴 ID가 포함되어 있습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }

  // 모든 메뉴가 해당 레스토랑의 메뉴인지 확인
  const invalidMenus = menus.filter(
    (menu) => menu.restaurantId !== restaurantId,
  );

  if (invalidMenus.length > 0) {
    throw new HttpException(
      '선택한 메뉴 중 해당 식당의 메뉴가 아닌 항목이 있습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
};

// 레스토랑 존재 여부 확인
export const validateRestaurantExists = (restaurantId: string): void => {
  const existRestaurant = restaurants.some(
    (restaurant) => restaurant.id === restaurantId,
  );

  if (!existRestaurant) {
    throw new HttpException(
      '존재하지 않는 레스토랑입니다.',
      HttpStatus.NOT_FOUND,
    );
  }
};

// 예약이 존재하는지 검증
export const validateReservationExists = async (
  reservationRepository: Repository<Reservation>,
  reservationId: string,
): Promise<Reservation> => {
  const reservation = await reservationRepository.findOne({
    relations: ['menus'],
    where: { id: reservationId },
  });

  if (!reservation) {
    throw new HttpException('예약을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  }
  return reservation;
};

// 예약이 본인의 것인지 검증
export const validateReservationOwnership = (
  reservation: Reservation,
  customerId: string,
): void => {
  if (customerId !== reservation.customerId) {
    throw new HttpException(
      '본인의 예약만 수정할 수 있습니다.',
      HttpStatus.FORBIDDEN,
    );
  }
};
