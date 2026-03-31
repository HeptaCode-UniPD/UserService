/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable max-lines-per-function */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';

describe('Auth (e2e)', () => {
    let app: INestApplication;
    let mongoConnection: Connection;
    let repoId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        mongoConnection = moduleFixture.get<Connection>(getConnectionToken());

        // Pulisce il DB
        for (const key in mongoConnection.collections) {
            await mongoConnection.collections[key].deleteMany({});
        }

        // Crea utente di test con password hashata
        const passwordHash = await bcrypt.hash('password123', 10);
        await mongoConnection.collection('users').insertOne({
            nome: 'Test',
            cognome: 'User',
            email: 'test@test.com',
            passwordHash,
        });
    }, 30000);

    afterAll(async () => {
        await app.close();
    }, 10000);

    describe('POST /auth/login', () => {
        it('dovrebbe fare login con credenziali corrette', async () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@test.com', password: 'password123' })
                .expect(200);
        });
        it('dovrebbe restituire 401 con credenziali errate', async () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@test.com', password: 'passwordsbagliata' })
                .expect(401);
        });
        it('dovrebbe restituire 401 se utente non esiste', async () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'nonesiste@test.com', password: '12345678' })
                .expect(401);
        });
    });

    describe('POST /repo', () => {
        it('dovrebbe aggiungere un repo', async () => {
            const res = await request(app.getHttpServer())
                .post('/repo')
                .send({ idUtente: 'user1', url: 'https://github.com/octocat/Hello-World' })
                .expect(201);

            repoId = res.body.id;
        });
        it('dovrebbe restituire 400 se URL non valido', async () => {
            return request(app.getHttpServer())
                .post('/repo')
                .send({ idUtente: 'user1', url: 'urlnonvalido' })
                .expect(400);
        });
        it('dovrebbe restituire 400 se repo GitHub non esiste', async () => {
            return request(app.getHttpServer())
                .post('/repo')
                .send({ idUtente: 'user1', url: 'https://github.com/utentechenoneesiste/repoinesistente123456' })
                .expect(400);
        });
    });

    describe('DELETE /repo', () => {
        it('dovrebbe eliminare un repo', async () => {
            return request(app.getHttpServer())
                .delete('/repo')
                .send({ idUtente: 'user1', idRepo: repoId }) // ✅ idRepo salvato dal POST
                .expect(200);
        });
        it('dovrebbe restituire 404 se repo non trovato', async () => {
            return request(app.getHttpServer())
                .delete('/repo')
                .send({ idUtente: 'user1', idRepo: 'id-inesistente' })
                .expect(404);
        });
    });
});