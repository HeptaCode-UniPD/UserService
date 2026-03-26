import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { UserService } from '../user/application/user.service';
import { UserEntity } from '../user/domain/user.entity';

const mockUserService = {
    register: jest.fn(),
    login: jest.fn(),
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
});