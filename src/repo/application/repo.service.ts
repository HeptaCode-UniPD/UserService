import { Inject, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { RepoEntity } from "../domain/repo.entity";
import { ValidatedSaveRepoDTO } from "../../ingestion/dto/validated-save-repo.dto";
import type { IRepoRepository } from "./ports/repo.repository.interface";
import { REPO_REPOSITORY } from "./ports/repo.repository.interface";
import type { GitHubServiceInterface } from "./ports/github.service.interface";
import { GITHUB_SERVICE } from "./ports/github.service.interface";
import { randomUUID } from 'node:crypto';

@Injectable()
export class RepoService {
    constructor(
        @Inject(REPO_REPOSITORY)
        private readonly repoRepository: IRepoRepository,
        @Inject(GITHUB_SERVICE)
        private readonly githubService: GitHubServiceInterface,
    ) {}

    async listForUser(userId: string) : Promise<RepoEntity[]> {
        const repos = await this.repoRepository.findByUserId(userId);
        return repos;
    }

    async addRepo(data: ValidatedSaveRepoDTO): Promise<RepoEntity> {
        const repoData = await this.githubService.validate(data.url);
        if (!repoData) {
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
            repoData.name,
            `s3://your-bucket/${repoId}`
        );

        return this.repoRepository.save(repo);
    }

    async deleteRepo(idUtente: string, idRepo: string): Promise<boolean> {
        const repo = await this.repoRepository.findById(idRepo);
        if (!repo) {
            throw new NotFoundException("Repository non trovato");
        }
        if (!repo.idUtente.includes(idUtente)) {
            throw new NotFoundException("Repository non trovato per questo utente");
        }
        if (repo.idUtente.length > 1) {
            await this.repoRepository.removeUser(repo.id, idUtente);
            return true;
        }
        return this.repoRepository.delete(repo.id);
    }
}