import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity()
export class Menu {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @Column()
  description: string;

  @ManyToMany(() => Reservation)
  reservation: Reservation[];
}
