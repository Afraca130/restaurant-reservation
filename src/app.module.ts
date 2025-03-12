import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature1Module } from './feature1/feature1.module';
import { typeOrmConfig } from './util/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), Feature1Module],
})
export class AppModule {}
