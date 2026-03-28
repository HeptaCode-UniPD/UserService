import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class SaveRepoDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    idUtente!: string;

    @ApiProperty({ example: 'https://github.com/org/repo' })
    @IsUrl({ protocols: ['https'], host_whitelist: ['github.com'] })
    url!: string;
}