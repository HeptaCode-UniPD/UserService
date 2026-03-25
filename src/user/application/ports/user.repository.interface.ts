import { UserEntity } from "./../../domain/user.entity";

export interface IUserRepository {
    findById(id:String):Promise<UserEntity | null>;
    findByEmail(email:String):Promise<UserEntity | null>;
    save(user:UserEntity):Promise<UserEntity>;
    existsByEmail(email:string):Promise<boolean>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");