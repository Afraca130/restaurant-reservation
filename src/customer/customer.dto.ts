import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
  Min,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LoginCustomerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsInt()
  @Min(1) // 최소 1명 이상
  @IsNotEmpty()
  peopleCount: number;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Number) // 배열 요소를 숫자로 변환
  menuIds: number[];
}

export class UpdateReservationDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsInt()
  @Min(1)
  @IsOptional() // 필수 입력이 아님
  peopleCount?: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Number)
  menuIds?: number[];
}
