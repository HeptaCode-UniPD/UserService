import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestionModule } from './ingestion/ingestion.module';
import { RepoModule } from './repo/repo.module';

@Module({
  imports: [
    // mi manca il nome del db guys quando arriva va aggiornato
    MongooseModule.forRoot(process.env.MONGO_URI!),
    IngestionModule,
    RepoModule,
  ],
})
export class AppModule {}