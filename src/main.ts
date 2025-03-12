import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './util/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exception-filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
