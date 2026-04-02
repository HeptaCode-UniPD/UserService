import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RepoPersistence, RepoSchema } from "./infrastructure/repo.schema";
import { RepoMongoRepository } from "./infrastructure/repo.mongo.repository";
import { RepoService } from "./application/repo.service";
import { REPO_REPOSITORY } from "./application/interfaces/repo.repository.interface";
import { GitHubAdapter } from "./infrastructure/github.adapter";
import { GITHUB_SERVICE } from "./application/interfaces/github.service.interface";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RepoPersistence.name, schema: RepoSchema }
        ])
    ],
    providers: [
        RepoService,
        {
            provide: REPO_REPOSITORY,
            useClass: RepoMongoRepository,
        },
        {
            provide: GITHUB_SERVICE,
            useClass: GitHubAdapter,
        }
    ],
    exports: [RepoService],
})
export class RepoModule {}