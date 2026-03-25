import { UserEntity } from "./user.entity";
import { UserPersistence } from "./user.schema";

export class UserMapper {
    static toDomain(p: UserPersistence): UserEntity {
        return new UserEntity(p._id, p.email, p.passwordHash);
    }

    static toPresistence(e: UserEntity): Partial<UserPersistence> { // qui probabilmente Partial non serve
        return {
            _id: e.id,
            email: e.email,
            passwordHash: e.passwordHash,
        };
    }
}