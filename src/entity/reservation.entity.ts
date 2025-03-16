import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { Menu } from './menu.entity';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index('idx_reservation_restaurant_date', ['restaurantId', 'date']) // 예약 날짜별 조회 최적화
@Index('idx_reservation_phone', ['phone']) // 전화번호 검색 최적화
@Index('idx_reservation_people', ['peopleCount']) // 최소 인원수 검색 최적화
export class Reservation extends Base {
  @ApiProperty({ description: '고객 ID' })
  @Column()
  @Index('idx_reservation_customer') // 고객 ID 기반 조회 최적화
  customerId: string;

  @ApiProperty({ description: '레스토랑 ID' })
  @Column()
  restaurantId: string;

  @ApiProperty({ description: '예약 날짜', example: '2025-01-01' })
  @Column({ type: 'date' })
  date: string;

  @ApiProperty({ description: '예약 시작 시간', example: '18:00' })
  @Column({ type: 'time' })
  @Index('idx_reservation_start_time') // 시작 시간 검색 최적화
  startTime: string; // 예약 시작 시간

  @ApiProperty({ description: '예약 종료 시간', example: '20:00' })
  @Column({ type: 'time' })
  @Index('idx_reservation_end_time') // 종료 시간 검색 최적화
  endTime: string; // 예약 종료 시간

  @ApiProperty({ description: '고객 연락처', example: '010-1234-5678' })
  @Column()
  phone: string;

  @ApiProperty({ description: '예약 인원수', minimum: 1 })
  @Column()
  peopleCount: number;

  @ApiProperty({ description: '예약한 메뉴 목록', type: [Menu] })
  @ManyToMany(() => Menu)
  @JoinTable()
  menus: Menu[];
}
