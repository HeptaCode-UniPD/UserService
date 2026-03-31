import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserEntity } from "./../domain/user.entity";
import { UserMapper } from "./user.mapper";
import { IUserRepository } from "./../application/ports/user.repository.interface";
import { UserPersistence, UserDocument } from "./user.schema";

@Injectable()
export class UserMongoRepository implements IUserRepository {
    constructor(
        @InjectModel(UserPersistence.name)
        private readonly model: Model<UserDocument>
    ) {}

    async findById(id: string): Promise<UserEntity | null> {
        const doc = await this.model
            .findById(id)
            .select('+passwordHash')
            .lean()
            .exec();
        return doc ? UserMapper.toDomain(doc as UserPersistence) : null;
    }
    
    async findByEmail(email: string): Promise<UserEntity | null> {
        const doc = await this.model
            .findOne({ email })
            .select('+passwordHash')
            .lean()
            .exec();
        return doc ? UserMapper.toDomain(doc as UserPersistence) : null;
    }
    
    async save(user: UserEntity): Promise<UserEntity> {
        const created = await this.model.create(UserMapper.toPersistence(user));
        return UserMapper.toDomain(created.toObject() as UserPersistence);
    }
    
    async existsByEmail(email: string): Promise<boolean> {
        const count = await this.model
            .countDocuments({email})
            .exec();
        return count > 0;
    }

}