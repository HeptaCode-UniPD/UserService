import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserDataDTO {
    @ApiProperty({ description: 'The email address of the user', example: 'user@example.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ description: 'The user password (minimum 8 characters)', example: 'strongpassword', minLength: 8 })
    @IsString()
    @MinLength(8)
    password!: string;
}