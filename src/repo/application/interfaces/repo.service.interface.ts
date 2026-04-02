import { RepoEntity } from "../../domain/repo.entity";
import { ValidatedSaveRepoDTO } from "../dto/validated-save-repo.dto";
import { ValidatedDeleteRepoDTO } from "../dto/validated-delete-repo.dto";

export interface RepoServiceLayerInterface {
    addRepo(data: ValidatedSaveRepoDTO): Promise<RepoEntity>;
    listForUser(userId: string): Promise<RepoEntity[]>;
    getRepoById(idRepo: string): Promise<RepoEntity>;
    deleteRepo(data: ValidatedDeleteRepoDTO): Promise<boolean>
}