import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

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
    });
});