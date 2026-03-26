import { IsString, IsUrl } from 'class-validator';

export class RepoDataDTO {
    @IsString()
    idUtente!: string;

    @IsUrl()
    url!: string;
}