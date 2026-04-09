// delete-repo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteRepoDto {
    @ApiProperty({ description: 'The unique identifier of the user', example: 'user-123' })
    @IsString()
    idUtente!: string;

    @ApiProperty({ description: 'The unique identifier of the repository to delete', example: 'repo-456' })
    @IsString()
    idRepo!: string;
}