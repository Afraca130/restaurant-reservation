import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Base } from './base.entity';
import { MenuCategory } from '../restaurant/restaurant.enums';

@Entity()
@Index('idx_menu_name', ['name']) // 메뉴 이름 검색 최적화
@Index('idx_menu_price', ['price']) // 가격 범위 검색 최적화
@Index('idx_menu_category', ['category']) // 카테고리 검색 최적화
export class Menu extends Base {
  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: MenuCategory })
  category: MenuCategory;

  @Column()
  description: string;

  @ManyToMany(() => Reservation)
  reservation: Reservation[];
}
