import { IsString, IsUrl } from 'class-validator';

export class SingleRepoDataDTO {
    @IsString()
    idUtente!: string;

    @IsUrl()
    url!: string;
}