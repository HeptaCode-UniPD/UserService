import { Module } from "@nestjs/common";
import { IngestionController } from "./ingestion.controller";
import { UserModule } from "../user/user.module";

@Module({
    imports: [UserModule],
    controllers: [IngestionController],
})
export class IngestionModule {}