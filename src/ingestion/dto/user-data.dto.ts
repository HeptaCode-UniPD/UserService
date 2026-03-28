import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserDataDTO {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: 'strongpassword', minLength: 8 })
    @IsString()
    @MinLength(8)
    password!: string;
}