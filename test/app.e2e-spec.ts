import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';

describe('Auth (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
        await app.close();
    });

    describe('POST /auth/register', () => {
        it('dovrebbe registrare un utente', async () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: 'test@test.com', password: '12345678' })
                .expect(201);
        });

        it('dovrebbe restituire 409 se email già esistente', async () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: 'test@test.com', password: '12345678' })
                .expect(409);
        });
    });

    describe('POST /auth/login', () => {
        it('dovrebbe fare login con credenziali corrette', async () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@test.com', password: '12345678' })
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
            return request(app.getHttpServer())
                .post('/repo')
                .send({ idUtente: 'user1', url: 'https://github.com/octocat/Hello-World' })
                .expect(201);
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
                .send({ idUtente: 'user1', url: 'https://github.com/octocat/Hello-World' })
                .expect(200);
        });

        it('dovrebbe restituire 404 se repo non trovato', async () => {
            return request(app.getHttpServer())
                .delete('/repo')
                .send({ idUtente: 'user1', url: 'https://github.com/owner/nonexistent' })
                .expect(404);
        });
    });
});