import { RepoEntity } from "../../../repo/domain/repo.entity";


export interface IRepoRepository {
    findById(id: string): Promise<RepoEntity | null>;
    findByUserId(userId: string): Promise<RepoEntity[]>;
    // ho cambiato il metodo perchè in questo caso se cerchiamo l'url lo cerchiamo per utente, 
    // ma può avere più utenti un repo!
    findByUrl(repoUrl: string): Promise<RepoEntity | null>;
    // questo invece ci serve per la delete; uno user se elimina il repo non lo elimina per tutti
    findByUrlAndUser(userId: string, repoUrl: string): Promise<RepoEntity | null>;
    save(repo: RepoEntity): Promise<RepoEntity>;
    // ho aggiunto questi due metodi:
    // delete() è facile da capire
    delete(id: string): Promise<boolean>;
    // addUser() serve perchè così possiamo aggiungere un utente all'array collegato al repo
    addUser(repoId: string, idUtente: string): Promise<RepoEntity>;
    // update(repo: RepoEntity): Promise<RepoEntity>;
}

export const REPO_REPOSITORY = Symbol('IRepoRepository');