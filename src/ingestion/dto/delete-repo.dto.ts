// delete-repo.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteRepoDto {
    @ApiProperty()
    @IsString()
    idUtente!: string;

    @ApiProperty()
    @IsString()
    idRepo!: string;
}