import { ApiProperty } from '@nestjs/swagger';
import { RepoEntity } from '../../repo/domain/repo.entity';

export class RepoResponseDto {
  @ApiProperty() id: string;
  @ApiProperty({ type: [String] }) idUtente: string[];
  @ApiProperty() url: string;

  static fromDomain(e: RepoEntity): RepoResponseDto {
    const dto = new RepoResponseDto();
    dto.id = e.id;
    dto.idUtente = e.idUtente;
    dto.url = e.url;
    return dto;
  }
}