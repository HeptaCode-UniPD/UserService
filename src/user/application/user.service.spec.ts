import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER_REPOSITORY } from './ports/user.repository.interface';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockUserRepository = {
    existsByEmail: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
};

// BDD

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: USER_REPOSITORY,
                    useValue: mockUserRepository,
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    afterEach(() => jest.clearAllMocks());

    describe('register', () => {
        it('dovrebbe lanciare ConflictException se email già esiste', async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(true);

            await expect(service.register({ email: 'test@test.com', password: '12345678' }))
                .rejects.toThrow(ConflictException);
        });

        it('dovrebbe salvare utente se email non esiste', async () => {
            mockUserRepository.existsByEmail.mockResolvedValue(false);
            mockUserRepository.save.mockResolvedValue({ id: '1', email: 'test@test.com' });

            const result = await service.register({ email: 'test@test.com', password: '12345678' });
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(result).toBeDefined();
        });
    });

    describe('login', () => {
        it('dovrebbe lanciare UnauthorizedException se utente non trovato', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(service.login({ email: 'test@test.com', password: '12345678' }))
                .rejects.toThrow(UnauthorizedException);
        });

        it('dovrebbe lanciare UnauthorizedException se password errata', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                passwordHash: 'hasherrato'
            });

            await expect(service.login({ email: 'test@test.com', password: 'passwordsbagliata' }))
                .rejects.toThrow(UnauthorizedException);
        });
    });
});