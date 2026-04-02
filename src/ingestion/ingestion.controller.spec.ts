import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { UserService } from '../user/application/user.service';
import { RepoService } from '../repo/application/repo.service';
import { UserEntity } from '../user/domain/user.entity';
import { RepoEntity } from '../repo/domain/repo.entity';
import { DeleteRepoDto } from './dto/delete-repo.dto';

const mockUserService = {
    getUser: jest.fn(),
    login: jest.fn(),
};
const mockRepoService = {
    addRepo: jest.fn(),
    deleteRepo: jest.fn(),
    listForUser: jest.fn(),
};

describe('IngestionController', () => {
    let controller: IngestionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IngestionController],
            providers: [
                { provide: UserService, useValue: mockUserService },
                { provide: RepoService, useValue: mockRepoService },
            ],
        }).compile();

        controller = module.get<IngestionController>(IngestionController);
    });

    afterEach(() => jest.clearAllMocks());

    describe('login', () => {
        it('dovrebbe chiamare userService.login con i dati corretti e restituire userId e email', async () => {
            const dto = { email: 'test@test.com', password: '12345678' };
            const fakeUser = new UserEntity('1', 'Nome', 'Cognome', dto.email, 'hash');
            mockUserService.login.mockResolvedValue(fakeUser);

            const result = await controller.login(dto);

            expect(mockUserService.login).toHaveBeenCalledWith(
                expect.objectContaining({ email: dto.email })
            );
            expect(result).toEqual({ userId: '1', email: dto.email });
        });
    });

    describe('profile', () => {
        it('dovrebbe chiamare userService.getUser con il corretto userId', async () => {
            const fakeUser = new UserEntity('1', 'Nome', 'Cognome', 'test@test.com', 'hash');
            mockUserService.getUser.mockResolvedValue(fakeUser);

            await controller.profile('1');

            expect(mockUserService.getUser).toHaveBeenCalledWith('1');
        });
    });

    describe('list', () => {
        it('dovrebbe chiamare repoService.listForUser e restituire i repo mappati', async () => {
            const fakeRepos = [
                new RepoEntity('r1', ['user1'], 'https://github.com/owner/repo', 'repo-name', 's3://bucket/1'),
            ];
            mockRepoService.listForUser.mockResolvedValue(fakeRepos);

            await controller.list('user1');

            expect(mockRepoService.listForUser).toHaveBeenCalledWith('user1');
        });
    });

    describe('addRepo', () => {
        it('dovrebbe chiamare repoService.addRepo con i dati corretti', async () => {
            const dto = { idUtente: 'user1', url: 'https://github.com/owner/repo' };
            mockRepoService.addRepo.mockResolvedValue(
                new RepoEntity('1', ['user1'], dto.url, 'repo-name', 's3://bucket/1')
            ); 

            const result = await controller.addRepo(dto);

            expect(mockRepoService.addRepo).toHaveBeenCalledWith(
                expect.objectContaining({ idUtente: dto.idUtente, url: dto.url })
            );
            expect(result).toEqual({ id: '1' });
        });
    });

    describe('deleteRepo', () => {
        it('dovrebbe chiamare repoService.deleteRepo con ValidatedDeleteRepoDTO corretto', async () => {
            const dto: DeleteRepoDto = { idUtente: 'user1', idRepo: 'repo1' };
            mockRepoService.deleteRepo.mockResolvedValue(undefined);
            await controller.deleteRepo(dto);
            expect(mockRepoService.deleteRepo).toHaveBeenCalledWith(
                expect.objectContaining({ idUtente: 'user1', idRepo: 'repo1' })
            );
        });
    });
});