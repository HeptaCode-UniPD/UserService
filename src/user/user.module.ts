import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserPersistence, UserSchema } from "./infrastructure/user.schema";
import { UserMongoRepository } from "./infrastructure/user.mongo.repository";
import { UserService } from "./application/user.service";
import { USER_REPOSITORY } from "./application/ports/user.repository.interface";

@Module({
    imports: [
        // registra lo schema UserPersistence per questo modulo
        MongooseModule.forFeature([
            { name: UserPersistence.name, schema: UserSchema }
        ])
    ],
    providers: [
        UserService,
        {
            //  lega il Symbol IUserRepository all'implementazione concreta UserMongoRepository
            provide: USER_REPOSITORY,
            useClass: UserMongoRepository,
        }
    ],
    // rende il service disponibile all'IngestionModule
    exports: [UserService],
})
export class UserModule {}