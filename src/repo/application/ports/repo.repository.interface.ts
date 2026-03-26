import { RepoEntity } from "../../../repo/domain/repo.entity";


export interface IRepoRepository {
    findById(id: string): Promise<RepoEntity | null>;
    findByUserId(userId: string): Promise<RepoEntity[]>;
    findByUrl(userId: string, repoUrl: string): Promise<RepoEntity | null>;
    save(repo: RepoEntity): Promise<RepoEntity>;
    // update(repo: RepoEntity): Promise<RepoEntity>;
}

export const REPO_REPOSITORY = Symbol('IRepoRepository');