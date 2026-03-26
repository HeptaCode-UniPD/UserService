import { Inject, Injectable } from "@nestjs/common";
import { RepoEntity } from "../domain/repo.entity";
import { ValidatedRepoDataDTO } from "../../ingestion/dto/validated-repo-data.dto";
import type { IRepoRepository } from "./ports/repo.repository.interface";
import { REPO_REPOSITORY } from "./ports/repo.repository.interface";
import type { GitHubServiceInterface } from "./ports/github.service.interface";
import { GITHUB_SERVICE } from "./ports/github.service.interface";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { randomUUID } from 'crypto';

@Injectable()
export class RepoService {
    constructor(
        @Inject(REPO_REPOSITORY)
        private readonly repoRepository: IRepoRepository,
        @Inject(GITHUB_SERVICE)
        private readonly githubService: GitHubServiceInterface,
    ) {}

    async addRepo(data: ValidatedRepoDataDTO): Promise<RepoEntity> {
        const isValid = await this.githubService.validate(data.url);
        if (!isValid) {
            throw new BadRequestException("Repository GitHub non valido o non esistente");
        }

        const existing = await this.repoRepository.findByUrl(data.url);
        if (existing) {
            return this.repoRepository.addUser(existing.id, data.idUtente);
        }

        const repoId = randomUUID();
        const repo = new RepoEntity(
            repoId,
            [data.idUtente],
            data.url,
            `s3://your-bucket/${repoId}`
        );

        return this.repoRepository.save(repo);
    }

    async deleteRepo(data: ValidatedRepoDataDTO): Promise<boolean> {
        const repo = await this.repoRepository.findByUrlAndUser(data.idUtente, data.url);
        if (!repo) {
            throw new NotFoundException("Repository non trovato");
        }
        return this.repoRepository.delete(repo.id);
    }
}