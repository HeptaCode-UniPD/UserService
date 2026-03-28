import { UserEntity } from "../domain/user.entity";
import { UserPersistence } from "./user.schema";

export class UserMapper {
    static toDomain(p: UserPersistence): UserEntity {
        return new UserEntity((p._id as any).toString(), p.nome, p.cognome, p.email, p.passwordHash);
    }

    static toPersistence(e: UserEntity): Partial<UserPersistence> { // qui probabilmente Partial non serve
        return {
            // _id: e.id,
            nome: e.nome,
            cognome: e.cognome,
            email: e.email,
            passwordHash: e.passwordHash,
        };
    }
}