import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class SaveRepoDto {
    @ApiProperty({ description: 'The unique identifier of the user who owns the repository', example: 'user-123' })
    @IsString()
    idUtente!: string;

    @ApiProperty({ description: 'The GitHub URL of the repository', example: 'https://github.com/org/repo' })
    @IsUrl({ protocols: ['https'], host_whitelist: ['github.com'] })
    url!: string;
}