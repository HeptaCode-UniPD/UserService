import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestionModule } from './ingestion/ingestion.module';
import { RepoModule } from './repo/repo.module';

@Module({
  imports: [    
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      connectionFactory: (connection: unknown) => {
          return connection;
      }
    }),
    IngestionModule,
    RepoModule,
  ],
})
export class AppModule {}