import { Entity, Column, ManyToMany, Index } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Base } from './base.entity';
import { MenuCategory } from '../restaurant/restaurant.enums';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Index('idx_menu_restaurant', ['restaurantId']) // 레스토랑 검색 최적화
@Index('idx_menu_name', ['name']) // 메뉴 이름 검색 최적화
@Index('idx_menu_price', ['price']) // 가격 범위 검색 최적화
@Index('idx_menu_category', ['category']) // 카테고리 검색 최적화
export class Menu extends Base {
  @ApiProperty({ description: '메뉴 이름' })
  @Column()
  name: string;

  @ApiProperty({ description: '메뉴 가격', example: 15000, minimum: 0 })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: '메뉴 카테고리', enum: MenuCategory })
  @Column({ type: 'enum', enum: MenuCategory })
  category: MenuCategory;

  @ApiProperty({ description: '메뉴 설명' })
  @Column()
  description: string;

  @ApiProperty({ description: '레스토랑 ID' })
  @Column()
  restaurantId: string;

  @ManyToMany(() => Reservation)
  reservation: Reservation[];
}
