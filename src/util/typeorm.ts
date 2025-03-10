import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Restaurant } from '../entity/restaurant.entity';
import { Menu } from '../entity/menu.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'restaurant_db',
  entities: [Restaurant, Menu],
  synchronize: true,
};
