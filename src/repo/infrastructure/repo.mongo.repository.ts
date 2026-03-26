import { Injectable } from "@nestjs/common";
import { IRepoRepository } from "../application/ports/repo.repository.interface";
import { RepoEntity } from "../domain/repo.entity";
import { InjectModel } from "@nestjs/mongoose";
import { RepoDocument, RepoPersistence } from "./repo.schema";
import { RepoMapper } from "./repo.mapper";
import { Model } from "mongoose";

@Injectable()
export class RepoMongoRepository implements IRepoRepository {
    constructor(
        @InjectModel(RepoPersistence.name)
        private readonly model: Model<RepoDocument>
    ) {}

    async findById(id: string): Promise<RepoEntity | null> {
        const doc = await this.model.findById(id).lean().exec();
        return doc ? RepoMapper.toDomain(doc as RepoPersistence) : null;
    }

    async findByUserId(userId: string): Promise<RepoEntity[]> {
        const doc = await this.model
            .find({userId})
            .sort({createdAt: -1})
            .limit(100)
            .lean()
            .exec();
        return doc.map((d) => RepoMapper.toDomain(d as RepoPersistence));
    }

    async findByUrl(userId: string, repoUrl: string): Promise<RepoEntity | null> {
        const doc = await this.model
            .findOne({userId, repoUrl})
            .lean()
            .exec();
            return doc ? RepoMapper.toDomain(doc as RepoPersistence) : null;
    }

    async save(repo: RepoEntity): Promise<RepoEntity> {
        const created = await this.model.create(RepoMapper.toPersistence(repo));

        return RepoMapper.toDomain(created.toObject());
    }
    
}