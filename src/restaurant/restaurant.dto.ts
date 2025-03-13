import {
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { MenuCategory } from './restaurant.enums';
import { Type } from 'class-transformer';

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
  @IsEnum(MenuCategory) // MenuCategory 값만 허용
  category: MenuCategory;

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
  @IsEnum(MenuCategory)
  category?: MenuCategory;

  @IsString()
  @IsOptional()
  description?: string;
}

export class MenuQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number) //Query 파라미터는 기본적으로 string이므로 숫자로 변환
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  category?: string;
}
