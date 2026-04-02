import { RepoEntity } from "../../domain/repo.entity";
import { ValidatedSaveRepoDTO } from "../dto/validated-save-repo.dto";

export interface RepoServiceLayerInterface {
    addRepo(data: ValidatedSaveRepoDTO): Promise<RepoEntity>;
    deleteRepo(idUtente: string, idRepo: string): Promise<boolean>;
    listForUser(userId: string): Promise<RepoEntity[]>;
    getRepoById(idRepo: string): Promise<RepoEntity>;
}