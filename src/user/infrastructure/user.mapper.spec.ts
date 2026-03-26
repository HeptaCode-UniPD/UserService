import { UserMapper } from './user.mapper';
import { UserEntity } from '../domain/user.entity';
import { UserPersistence } from './user.schema';

describe('UserMapper', () => {

    describe('toDomain', () => {
        it('dovrebbe mappare correttamente UserPersistence → UserEntity', () => {
            const persistence: UserPersistence = {
                _id: '123',
                email: 'test@test.com',
                passwordHash: 'hashedpassword'
            };

            const entity = UserMapper.toDomain(persistence);

            expect(entity).toBeInstanceOf(UserEntity);
            expect(entity.id).toBe('123');
            expect(entity.email).toBe('test@test.com');
            expect(entity.passwordHash).toBe('hashedpassword');
        });
    });

    describe('toPersistence', () => {
        it('dovrebbe mappare correttamente UserEntity → UserPersistence', () => {
            const entity = new UserEntity('123', 'test@test.com', 'hashedpassword');

            const persistence = UserMapper.toPresistence(entity);

            expect(persistence._id).toBe('123');
            expect(persistence.email).toBe('test@test.com');
            expect(persistence.passwordHash).toBe('hashedpassword');
        });
    });
});