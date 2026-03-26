import { Module } from "@nestjs/common";
import { IngestionController } from "./ingestion.controller";
import { UserModule } from "../user/user.module";
import { RepoModule } from "../repo/repo.module";

@Module({
    imports: [UserModule, RepoModule],
    controllers: [IngestionController],
})
export class IngestionModule {}