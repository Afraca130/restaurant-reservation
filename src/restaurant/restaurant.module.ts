import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from '../entity/menu.entity';
import { RestaurantService } from './restaurant.service';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), AuthModule],
  controllers: [RestaurantController],
  providers: [RestaurantService, AuthService],
})
export class RestaurantModule {}
