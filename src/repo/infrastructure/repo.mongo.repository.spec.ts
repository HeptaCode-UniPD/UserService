import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { RepoMongoRepository } from './repo.mongo.repository';
import { RepoPersistence } from './repo.schema';
import { RepoEntity } from '../domain/repo.entity';

const mockRepoDoc = {
    _id: '123',
    idUtente: ['user1'],
    url: 'https://github.com/owner/repo',
    name: 'repo',
    pathStorage: 's3://bucket/123',
    toObject: jest.fn().mockReturnValue({
        _id: '123',
        idUtente: ['user1'],
        url: 'https://github.com/owner/repo',
        name: 'repo',
        pathStorage: 's3://bucket/123',
    })
};

const mockModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findByIdAndUpdate: jest.fn(),
};

describe('RepoMongoRepository', () => {
    let repository: RepoMongoRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RepoMongoRepository,
                {
                    provide: getModelToken(RepoPersistence.name),
                    useValue: mockModel,
                }
            ],
        }).compile();

        repository = module.get<RepoMongoRepository>(RepoMongoRepository);
    });

    afterEach(() => jest.clearAllMocks());

    describe('findById', () => {
        it('dovrebbe restituire RepoEntity se trovato', async () => {
            mockModel.findById.mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockRepoDoc),
            });

            const result = await repository.findById('123');

            expect(result).toBeInstanceOf(RepoEntity);
            expect(result?.id).toBe('123');
        });

        it('dovrebbe restituire null se non trovato', async () => {
            mockModel.findById.mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await repository.findById('999');
            expect(result).toBeNull();
        });
    });

    describe('findByUserId', () => {
        it('dovrebbe restituire array di RepoEntity', async () => {
            mockModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockRepoDoc]),
            });

            const result = await repository.findByUserId('user1');

            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(RepoEntity);
        });

        it('dovrebbe restituire array vuoto se nessun repo trovato', async () => {
            mockModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([]),
            });

            const result = await repository.findByUserId('userinesistente');
            expect(result).toHaveLength(0);
        });
    });

    describe('findByUrl', () => {
        it('dovrebbe restituire RepoEntity se trovato', async () => {
            mockModel.findOne.mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(mockRepoDoc),
            });

            const result = await repository.findByUrl('https://github.com/owner/repo');
            expect(result).toBeInstanceOf(RepoEntity);
        });

        it('dovrebbe restituire null se non trovato', async () => {
            mockModel.findOne.mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await repository.findByUrl('https://github.com/owner/nonexistent');
            expect(result).toBeNull();
        });
    });

    describe('save', () => {
        it('dovrebbe salvare e restituire RepoEntity', async () => {
            mockModel.create.mockResolvedValue(mockRepoDoc);

            const entity = new RepoEntity('123', ['user1'], 'https://github.com/owner/repo', 'repo', 's3://bucket/123');
            const result = await repository.save(entity);

            expect(mockModel.create).toHaveBeenCalled();
            expect(result).toBeInstanceOf(RepoEntity);
        });
    });

    describe('delete', () => {
        it('dovrebbe restituire true se eliminato', async () => {
            mockModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRepoDoc),
            });

            const result = await repository.delete('123');
            expect(result).toBe(true);
        });

        it('dovrebbe restituire false se non trovato', async () => {
            mockModel.findByIdAndDelete.mockReturnValue({
                exec: jest.fn().mockResolvedValue(null),
            });

            const result = await repository.delete('999');
            expect(result).toBe(false);
        });
    });

    describe('addUser', () => {
        it('dovrebbe aggiungere utente e restituire RepoEntity aggiornata', async () => {
            const updatedDoc = {
                ...mockRepoDoc,
                idUtente: ['user1', 'user2'],
                toObject: jest.fn().mockReturnValue({ ...mockRepoDoc, idUtente: ['user1', 'user2'] })
            };
            mockModel.findByIdAndUpdate.mockReturnValue({
                lean: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(updatedDoc),
            });

            const result = await repository.addUser('123', 'user2');

            expect(result).toBeInstanceOf(RepoEntity);
            expect(result.idUtente).toContain('user2');
        });
    });
});