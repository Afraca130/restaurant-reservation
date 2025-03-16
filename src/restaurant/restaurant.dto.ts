import {
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MenuCategory } from './restaurant.enums';
import { Type } from 'class-transformer';

export class RestaurantLoginDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class CreateMenuDto {
  @ApiProperty({ description: '메뉴 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '가격', minimum: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: '카테고리', enum: MenuCategory })
  @IsString()
  @IsNotEmpty()
  @IsEnum(MenuCategory)
  category: MenuCategory;

  @ApiProperty({ description: '메뉴 설명' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class UpdateMenuDto {
  @ApiProperty({ description: '메뉴 ID' })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: '메뉴 이름', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '가격', required: false, minimum: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  price?: number;

  @ApiProperty({ description: '카테고리', required: false, enum: MenuCategory })
  @IsString()
  @IsOptional()
  @IsEnum(MenuCategory)
  category?: MenuCategory;

  @ApiProperty({ description: '메뉴 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class MenuQueryDto {
  @ApiProperty({ description: '메뉴 이름', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '최소 가격', required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiProperty({ description: '최대 가격', required: false, type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({ description: '카테고리', required: false })
  @IsOptional()
  @IsString()
  category?: string;
}
