import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserMongoRepository } from './user.mongo.repository';
import { UserPersistence } from './user.schema';
import { UserEntity } from '../domain/user.entity';

const mockUserDoc = {
    _id: '123',
    email: 'test@test.com',
    passwordHash: 'hashedpassword',
    toObject: jest.fn().mockReturnValue({
        _id: '123',
        email: 'test@test.com',
        passwordHash: 'hashedpassword',
    })
};

const mockModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
};

describe('UserMongoRepository', () => {
    let repository: UserMongoRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserMongoRepository,
                {
                    provide: getModelToken(UserPersistence.name),
                    useValue: mockModel,
                }
            ],
        }).compile();

        repository = module.get<UserMongoRepository>(UserMongoRepository);
    });

    afterEach(() => jest.clearAllMocks());

    describe('findById', () => {
        it('dovrebbe restituire UserEntity se trovato', async () => {
            mockModel.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockUserDoc),
            });

            const result = await repository.findById('123');

            expect(result).toBeInstanceOf(UserEntity);
            expect(result?.id).toBe('123');
        });

        it('dovrebbe restituire null se non trovato', async () => {
            mockModel.findById.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await repository.findById('999');
            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('dovrebbe restituire UserEntity se trovato', async () => {
            mockModel.findOne.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockUserDoc),
            });

            const result = await repository.findByEmail('test@test.com');
            expect(result).toBeInstanceOf(UserEntity);
            expect(result?.email).toBe('test@test.com');
        });

        it('dovrebbe restituire null se non trovato', async () => {
            mockModel.findOne.mockReturnValue({
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await repository.findByEmail('nonesiste@test.com');
            expect(result).toBeNull();
        });
    });

    describe('save', () => {
        it('dovrebbe salvare e restituire UserEntity', async () => {
            mockModel.create.mockResolvedValue(mockUserDoc);

            const entity = new UserEntity('123', 'test@test.com', 'hashedpassword');
            const result = await repository.save(entity);

            expect(mockModel.create).toHaveBeenCalled();
            expect(result).toBeInstanceOf(UserEntity);
        });
    });

    describe('existsByEmail', () => {
        it('dovrebbe restituire true se email esiste', async () => {
            mockModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(1),
            });

            const result = await repository.existsByEmail('test@test.com');
            expect(result).toBe(true);
        });

        it('dovrebbe restituire false se email non esiste', async () => {
            mockModel.countDocuments.mockReturnValue({
                exec: jest.fn().mockResolvedValue(0),
            });

            const result = await repository.existsByEmail('nonesiste@test.com');
            expect(result).toBe(false);
        });
    });
});