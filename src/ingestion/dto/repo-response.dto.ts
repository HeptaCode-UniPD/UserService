import { ApiProperty } from '@nestjs/swagger';
import { RepoEntity } from '../../repo/domain/repo.entity';

export class RepoResponseDto {
  @ApiProperty({ description: 'The unique identifier of the repository', example: 'repo-456' }) 
  id: string;

  @ApiProperty({ description: 'List of user IDs associated with this repository', type: [String], example: ['user-123'] }) 
  idUtente: string[];

  @ApiProperty({ description: 'The URL of the repository', example: 'https://github.com/org/repo' }) 
  url: string;

  @ApiProperty({ description: 'The name of the repository', example: 'my-project' }) 
  name: string;

  static fromDomain(e: RepoEntity): RepoResponseDto {
    const dto = new RepoResponseDto();
    dto.id = e.id;
    dto.idUtente = e.idUtente;
    dto.url = e.url;
    dto.name = e.name;
    return dto;
  }
}