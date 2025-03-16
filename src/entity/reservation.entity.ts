import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { Menu } from './menu.entity';
import { Base } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index('idx_reservation_restaurant_date', ['restaurantId', 'date']) // 예약(해당날짜) 날짜별 조회 최적화
@Index('idx_reservation_customer', ['customerId', 'date']) // 고객(해당날짜) 검색 최적화
export class Reservation extends Base {
  @ApiProperty({ description: '고객 ID' })
  @Column()
  customerId: string;

  @ApiProperty({ description: '레스토랑 ID' })
  @Column()
  restaurantId: string;

  @ApiProperty({ description: '예약 날짜', example: '2025-01-01' })
  @Column({ type: 'date' })
  date: string;

  @ApiProperty({ description: '예약 시작 시간', example: '18:00' })
  @Column({ type: 'time' })
  startTime: string; // 예약 시작 시간

  @ApiProperty({ description: '예약 종료 시간', example: '20:00' })
  @Column({ type: 'time' })
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
