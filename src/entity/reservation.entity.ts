import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Menu } from './menu.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: string;

  @Column()
  restaurantId: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  time: string;

  @Column()
  phone: string;

  @Column()
  peopleCount: number;

  @ManyToMany(() => Menu)
  @JoinTable()
  menus: Menu[];
}
