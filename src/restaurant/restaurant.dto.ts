import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';

export class RestaurantLoginDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1) // 가격은 1 이상이어야 함
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['양식', '일식', '중식']) // 특정 값만 허용
  category: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateMenuDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  @IsIn(['양식', '일식', '중식']) // 선택적이지만 값이 있다면 유효성 검사
  category?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
