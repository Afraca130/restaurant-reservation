import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: '액세스 토큰', example: 'eyJhbGciOiJIUzI1...' })
  accessToken: string;
}
