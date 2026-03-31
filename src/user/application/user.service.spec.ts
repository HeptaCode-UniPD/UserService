import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { USER_REPOSITORY } from './ports/user.repository.interface';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserRepository = {
    existsByEmail: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
};

const createTestingModule = async (): Promise<UserService> => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [
            UserService,
            {
                provide: USER_REPOSITORY,
                useValue: mockUserRepository,
            }
        ],
    }).compile();
    return module.get<UserService>(UserService);
};

/*
describe('UserService - register', () => {
    let service: UserService;

    beforeEach(async () => { service = await createTestingModule(); });
    afterEach(() => jest.clearAllMocks());

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

    it('dovrebbe hashare la password prima di salvarla', async () => {
        mockUserRepository.existsByEmail.mockResolvedValue(false);
        mockUserRepository.save.mockResolvedValue({
            id: '1',
            email: 'test@test.com',
            passwordHash: 'hashedpassword'
        });
        await service.register({ email: 'test@test.com', password: '12345678' });
        const savedUser = mockUserRepository.save.mock.calls[0]?.[0] as UserEntity;
        expect(savedUser.passwordHash).not.toBe('12345678');
        expect(savedUser.passwordHash).toMatch(/^\$2b\$/);
    });
});
*/

describe('UserService - login', () => {
    let service: UserService;

    beforeEach(async () => { service = await createTestingModule(); });
    afterEach(() => jest.clearAllMocks());

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

    it('dovrebbe restituire UserEntity se credenziali corrette', async () => {
        const hash = (await (bcrypt as any).hash('12345678', 10)) as string;
        mockUserRepository.findByEmail.mockResolvedValue({
            id: '1',
            email: 'test@test.com',
            passwordHash: hash
        });
        const result = await service.login({ email: 'test@test.com', password: '12345678' });
        expect(result).toBeDefined();
        expect(result.email).toBe('test@test.com');
    });
});