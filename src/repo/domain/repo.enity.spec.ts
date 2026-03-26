import { RepoEntity } from './repo.entity';

describe('RepoEntity', () => {

    it('dovrebbe creare un repo con i valori corretti', () => {
        const entity = new RepoEntity(
            '123',
            ['user1', 'user2'],
            'https://github.com/owner/repo',
            's3://bucket/123'
        );

        expect(entity.id).toBe('123');
        expect(entity.idUtente).toEqual(['user1', 'user2']);
        expect(entity.url).toBe('https://github.com/owner/repo');
        expect(entity.pathStorage).toBe('s3://bucket/123');
    });

    it('dovrebbe esporre i valori solo tramite getter', () => {
        const entity = new RepoEntity('123', ['user1'], 'https://github.com/owner/repo', 's3://bucket/123');

        expect((entity as any)['#id']).toBeUndefined();
        expect((entity as any)['#idUtente']).toBeUndefined();
        expect((entity as any)['#url']).toBeUndefined();
        expect((entity as any)['#pathStorage']).toBeUndefined();
    });

});