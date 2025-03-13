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
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

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
  menuIds: string[];
}

export class UpdateReservationDto {
  @IsString()
  @IsNotEmpty()
  id: string;

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
  menuIds?: string[];
}
