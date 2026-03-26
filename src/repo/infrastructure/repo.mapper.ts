import { RepoEntity } from "../../repo/domain/repo.entity";
import { RepoPersistence } from "./repo.schema";


export class RepoMapper {
    static toDomain(p: RepoPersistence): RepoEntity {
        return new RepoEntity(p._id, p.idUtente, p.url, p.pathStorage);
    }

    static toPersistence(e: RepoEntity): RepoPersistence {
        const p =  new RepoPersistence();

        p._id = e.id;
        p.idUtente = e.idUtente;
        p.url = e.url;
        p.pathStorage = e.pathStorage;

        return p;
    }
}