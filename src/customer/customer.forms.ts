import { IsNotEmpty, IsNumber, IsString, IsArray, Min } from 'class-validator';

export class CreateCustomerForm {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  restaurantId: number;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @Min(1)
  peopleCount: number;

  @IsArray()
  @IsNumber({}, { each: true })
  menuIds: number[];
}
