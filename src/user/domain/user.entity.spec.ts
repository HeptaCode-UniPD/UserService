import { UserEntity } from './user.entity';

describe('UserEntity', () => {

    it('dovrebbe creare un utente con i valori corretti', () => {
        const entity = new UserEntity('123', 'Mario', 'Rossi', 'test@test.com', 'hashedpassword');

        expect(entity.id).toBe('123');
        expect(entity.nome).toBe('Mario');
        expect(entity.cognome).toBe('Rossi');
        expect(entity.email).toBe('test@test.com');
        expect(entity.passwordHash).toBe('hashedpassword');
    });
});