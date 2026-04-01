import { Test, TestingModule } from '@nestjs/testing';
import { RepoService } from './repo.service';
import { REPO_REPOSITORY } from './ports/repo.repository.interface';
import { GITHUB_SERVICE } from './ports/github.service.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RepoEntity } from '../domain/repo.entity';

const mockRepoRepository = {
    findByUrl: jest.fn(),
    findByUrlAndUser: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    addUser: jest.fn(),
    removeUser: jest.fn(),
};

const mockGithubService = {
    validate: jest.fn(),
};

const mockRepo = new RepoEntity('123', ['user1'], 'https://github.com/owner/repo', 'repo', 's3://bucket/123');

describe('RepoService', () => {
    let service: RepoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RepoService,
                { provide: REPO_REPOSITORY, useValue: mockRepoRepository },
                { provide: GITHUB_SERVICE, useValue: mockGithubService },
            ],
        }).compile();

        service = module.get<RepoService>(RepoService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('addRepo', () => {
        it('dovrebbe lanciare BadRequestException se repo GitHub non valido', async () => {
            mockGithubService.validate.mockResolvedValue(false);

            await expect(service.addRepo({ idUtente: 'user1', url: 'https://github.com/owner/repo' }))
                .rejects.toThrow(BadRequestException);
        });

        it('dovrebbe aggiungere utente se repo già esiste', async () => {
            mockGithubService.validate.mockResolvedValue(true);
            mockRepoRepository.findByUrl.mockResolvedValue(mockRepo);
            mockRepoRepository.addUser.mockResolvedValue(mockRepo);

            await service.addRepo({ idUtente: 'user2', url: 'https://github.com/owner/repo' });

            expect(mockRepoRepository.addUser).toHaveBeenCalledWith('123', 'user2');
            expect(mockRepoRepository.save).not.toHaveBeenCalled();
        });

        it('dovrebbe creare nuovo repo se non esiste', async () => {
            mockGithubService.validate.mockResolvedValue(true);
            mockRepoRepository.findByUrl.mockResolvedValue(null);
            mockRepoRepository.save.mockResolvedValue(mockRepo);

            await service.addRepo({ idUtente: 'user1', url: 'https://github.com/owner/repo' });

            expect(mockRepoRepository.save).toHaveBeenCalled();
            expect(mockRepoRepository.addUser).not.toHaveBeenCalled();
        });
    });

    describe('deleteRepo', () => {
        it('dovrebbe lanciare NotFoundException se repo non trovato', async () => {
            mockRepoRepository.findById.mockResolvedValue(null);

            await expect(service.deleteRepo('user1', '123'))
                .rejects.toThrow(NotFoundException);
        });

        it('dovrebbe eliminare repo se era l\'unico utente', async () => {
            mockRepoRepository.findById.mockResolvedValue(mockRepo); 
            mockRepoRepository.delete.mockResolvedValue(true);

            const result = await service.deleteRepo('user1', '123');

            expect(mockRepoRepository.delete).toHaveBeenCalledWith('123');
            expect(result).toBe(true);
        });

        it('dovrebbe rimuovere solo utente se repo ha altri utenti', async () => {
            const mockRepoMultiUser = new RepoEntity('123', ['user1', 'user2'], 'https://github.com/owner/repo', 'repo', 's3://bucket/123');
            mockRepoRepository.findById.mockResolvedValue(mockRepoMultiUser);
            mockRepoRepository.removeUser = jest.fn().mockResolvedValue(mockRepoMultiUser);

            await service.deleteRepo('user1', '123');

            expect(mockRepoRepository.removeUser).toHaveBeenCalledWith('123', 'user1');
            expect(mockRepoRepository.delete).not.toHaveBeenCalled();
        });
    });

    describe('getRepoById', () => {
        it('should return a repo if found', async () => {
        mockRepoRepository.findById.mockResolvedValue(mockRepoRepository);

        const result = await service.getRepoById('123');

        expect(mockRepoRepository.findById).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockRepoRepository);
        });

        it('should throw a NotFoundException if repo is not found', async () => {
        mockRepoRepository.findById.mockResolvedValue(null);

        await expect(service.getRepoById('non-existent')).rejects.toThrow(
            NotFoundException,
        );
        expect(mockRepoRepository.findById).toHaveBeenCalledWith('non-existent');
        });
    });
});