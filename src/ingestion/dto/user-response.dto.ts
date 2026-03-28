import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserEntity } from '../../user/domain/user.entity';

export class UserResponseDTO {

    @ApiProperty({ example: 'Mario' })
    @IsString()
    nome!: string;
    
    @ApiProperty({ example: 'Rossi' })
    @IsString()
    cognome!: string;

    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email!: string;

    static fromDomain(e: UserEntity): UserResponseDTO {
        const dto = new UserResponseDTO;
        dto.nome = e.nome;
        dto.cognome = e.cognome;
        dto.email = e.email;

        return dto;
    }
}