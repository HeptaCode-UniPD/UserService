import { UserEntity } from './user.entity';

describe('UserEntity', () => {

    it('dovrebbe creare un utente con i valori corretti', () => {
        const entity = new UserEntity('123', 'test@test.com', 'hashedpassword');

        expect(entity.id).toBe('123');
        expect(entity.email).toBe('test@test.com');
        expect(entity.passwordHash).toBe('hashedpassword');
    });

    it('dovrebbe esporre i valori solo tramite getter', () => {
        const entity = new UserEntity('123', 'test@test.com', 'hashedpassword');

        // i campi privati non sono accessibili direttamente
        expect((entity as any)['#id']).toBeUndefined();
        expect((entity as any)['#email']).toBeUndefined();
        expect((entity as any)['#passwordHash']).toBeUndefined();
    });

});