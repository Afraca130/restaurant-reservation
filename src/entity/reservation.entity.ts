import { Entity, Column, ManyToMany, JoinTable, Index } from 'typeorm';
import { Menu } from './menu.entity';
import { Base } from './base.entity';

@Entity()
@Index('idx_reservation_restaurant_date', ['restaurantId', 'date']) // 예약 날짜별 조회 최적화
@Index('idx_reservation_phone', ['phone']) // 전화번호 검색 최적화
@Index('idx_reservation_people', ['peopleCount']) // 최소 인원수 검색 최적화
export class Reservation extends Base {
  @Column()
  @Index('idx_reservation_customer') // 고객 ID 기반 조회 최적화
  customerId: string;

  @Column()
  restaurantId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  @Index('idx_reservation_start_time') // 시작 시간 검색 최적화
  startTime: string; // 예약 시작 시간

  @Column({ type: 'time' })
  @Index('idx_reservation_end_time') // 종료 시간 검색 최적화
  endTime: string; // 예약 종료 시간

  @Column()
  phone: string;

  @Column()
  peopleCount: number;

  @ManyToMany(() => Menu)
  @JoinTable()
  menus: Menu[];
}
