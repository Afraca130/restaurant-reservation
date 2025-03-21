import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsArray,
  Min,
  IsDateString,
  ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCustomerDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateReservationDto {
  @ApiProperty({ description: '레스토랑 ID' })
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @ApiProperty({ description: '예약 날짜 (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: '시작 시간 (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: '종료 시간 (HH:mm)' })
  @IsString()
  @IsNotEmpty()
  endTime: string;

  @ApiProperty({ description: '고객 연락처' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: '예약 인원 수', minimum: 1 })
  @IsInt()
  @IsNotEmpty()
  peopleCount: number;

  @ApiProperty({ description: '메뉴 ID 목록', type: [String] })
  @IsArray()
  @ArrayNotEmpty() // 배열이 비어있으면 검증 실패
  @IsString({ each: true }) // 배열 내부 요소가 문자열인지 검증
  menuIds: string[];
}

export class UpdateReservationDto {
  @ApiProperty({ description: '예약 인원 수', required: false, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  peopleCount?: number;

  @ApiProperty({ description: '메뉴 ID 목록', type: [String], required: false })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  menuIds?: string[];
}
