import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { UserService } from '../user/application/user.service';
import { RepoService } from '../repo/application/repo.service';
import { UserEntity } from '../user/domain/user.entity';
import { RepoEntity } from '../repo/domain/repo.entity';

const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
};

const mockRepoService = {
    addRepo: jest.fn(),
    deleteRepo: jest.fn(),
};

describe('IngestionController', () => {
    let controller: IngestionController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [IngestionController],
            providers: [
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: RepoService,
                    useValue: mockRepoService,
                }
            ],
        }).compile();

        controller = module.get<IngestionController>(IngestionController);
    });

    afterEach(() => jest.clearAllMocks());

    describe('register', () => {
        it('dovrebbe chiamare userService.register con i dati corretti', async () => {
            const dto = { email: 'test@test.com', password: '12345678' };
            mockUserService.register.mockResolvedValue(new UserEntity('1', dto.email, 'hash'));

            await controller.register(dto);

            expect(mockUserService.register).toHaveBeenCalledWith(
                expect.objectContaining({ email: dto.email })
            );
        });
    });

    describe('login', () => {
        it('dovrebbe chiamare userService.login con i dati corretti', async () => {
            const dto = { email: 'test@test.com', password: '12345678' };
            mockUserService.login.mockResolvedValue(new UserEntity('1', dto.email, 'hash'));

            await controller.login(dto);

            expect(mockUserService.login).toHaveBeenCalledWith(
                expect.objectContaining({ email: dto.email })
            );
        });
    });

    describe('addRepo', () => {
        it('dovrebbe chiamare repoService.addRepo con i dati corretti', async () => {
            const dto = { idUtente: 'user1', url: 'https://github.com/owner/repo' };
            mockRepoService.addRepo.mockResolvedValue(
                new RepoEntity('1', ['user1'], dto.url, 's3://bucket/1')
            );

            await controller.addRepo(dto);

            expect(mockRepoService.addRepo).toHaveBeenCalledWith(
                expect.objectContaining({ idUtente: dto.idUtente, url: dto.url })
            );
        });
    });

    describe('deleteRepo', () => {
        it('dovrebbe chiamare repoService.deleteRepo con i dati corretti', async () => {
            const dto = { idUtente: 'user1', url: 'https://github.com/owner/repo' };
            mockRepoService.deleteRepo.mockResolvedValue(true);

            await controller.deleteRepo(dto);

            expect(mockRepoService.deleteRepo).toHaveBeenCalledWith(
                expect.objectContaining({ idUtente: dto.idUtente, url: dto.url })
            );
        });
    });
});