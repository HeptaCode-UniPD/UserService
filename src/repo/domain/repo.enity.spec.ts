import { RepoEntity } from './repo.entity';

describe('RepoEntity', () => {
    it('dovrebbe creare un repo con i valori corretti', () => {
        const entity = new RepoEntity(
            '123',
            ['user1', 'user2'],
            'https://github.com/owner/repo',
            'repo',                          // ← name aggiunto
            's3://bucket/123'
        );

        expect(entity.id).toBe('123');
        expect(entity.idUtente).toEqual(['user1', 'user2']);
        expect(entity.url).toBe('https://github.com/owner/repo');
        expect(entity.name).toBe('repo');
        expect(entity.pathStorage).toBe('s3://bucket/123');
    });
});