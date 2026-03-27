import { IsString } from 'class-validator';

export class GetReposDataDTO {
    @IsString()
    idUtente!: string;
}