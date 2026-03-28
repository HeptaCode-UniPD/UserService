import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'Authenticated user id' })
  userId: string;

  @ApiProperty({ description: 'Authenticated user email' })
  email: string;
}