import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Restaurant API')
  .setDescription('식당 예약 시스템 API 문서')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
