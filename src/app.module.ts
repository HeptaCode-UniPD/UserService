import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IngestionModule } from './ingestion/ingestion.module';
import { RepoModule } from './repo/repo.module';
import * as mongoose from 'mongoose';

@Module({
  imports: [
    // mi manca il nome del db guys quando arriva va aggiornato
    
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      connectionFactory: (connection) => {
        console.log('✅ MongoDB connesso a:', connection.host, '/', connection.name);
        return connection;
      }
    }),

    IngestionModule,
    RepoModule,
  ],
})
export class AppModule {}