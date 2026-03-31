import { Injectable, NotFoundException } from "@nestjs/common";
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
            .find({idUtente: userId})
            .sort({createdAt: -1})
            .limit(100)
            .lean()
            .exec();
        return doc.map((d) => RepoMapper.toDomain(d as RepoPersistence));
    }

    async findByUrl(repoUrl: string): Promise<RepoEntity | null> {
        const doc = await this.model
            .findOne({url: repoUrl})
            .lean()
            .exec();
            return doc ? RepoMapper.toDomain(doc as RepoPersistence) : null;
    }

    async save(repo: RepoEntity): Promise<RepoEntity> {
        const created = await this.model.create(RepoMapper.toPersistence(repo));

        return RepoMapper.toDomain(created.toObject());
    }

    async findByUrlAndUser(userId: string, repoUrl: string): Promise<RepoEntity | null> {
    const doc = await this.model
        .findOne({ url: repoUrl, idUtente: userId })
        .lean()
        .exec();
    return doc ? RepoMapper.toDomain(doc as RepoPersistence) : null;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model
            .findByIdAndDelete(id)
            .exec();
        return result !== null;
    }

    async addUser(repoId: string, idUtente: string): Promise<RepoEntity> {
            const doc = await this.model
                .findByIdAndUpdate(
                    repoId,
                    { $push: { idUtente: idUtente } },
                    { new: true }
                )
                .lean()
                .exec();
            if (!doc) throw new NotFoundException("Repository non trovato");
            return RepoMapper.toDomain(doc as RepoPersistence);
        }

        async removeUser(repoId: string, idUtente: string): Promise<RepoEntity> {
        const doc = await this.model
            .findByIdAndUpdate(
                repoId,
                { $pull: { idUtente: idUtente } },
                { new: true }
            )
            .lean()
            .exec();
        if (!doc) throw new NotFoundException("Repository non trovato");
        return RepoMapper.toDomain(doc as RepoPersistence);
    }
}