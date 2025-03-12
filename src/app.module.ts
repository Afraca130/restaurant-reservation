import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmConfigService } from './util/typeorm';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    RestaurantModule,
    CustomerModule,
    AuthModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
