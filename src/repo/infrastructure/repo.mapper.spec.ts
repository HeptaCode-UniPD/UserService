import { RepoMapper } from './repo.mapper';
import { RepoEntity } from '../domain/repo.entity';
import { RepoPersistence } from './repo.schema';

describe('RepoMapper', () => {

    describe('toDomain', () => {
        it('dovrebbe mappare correttamente RepoPersistence → RepoEntity', () => {
            const persistence: RepoPersistence = {
                _id: '123',
                idUtente: ['user1', 'user2'],
                url: 'https://github.com/owner/repo',
                pathStorage: 's3://bucket/123',
            };

            const entity = RepoMapper.toDomain(persistence);

            expect(entity).toBeInstanceOf(RepoEntity);
            expect(entity.id).toBe('123');
            expect(entity.idUtente).toEqual(['user1', 'user2']);
            expect(entity.url).toBe('https://github.com/owner/repo');
            expect(entity.pathStorage).toBe('s3://bucket/123');
        });
    });

    describe('toPersistence', () => {
        it('dovrebbe mappare correttamente RepoEntity → RepoPersistence', () => {
            const entity = new RepoEntity('123', ['user1', 'user2'], 'https://github.com/owner/repo', 's3://bucket/123');

            const persistence = RepoMapper.toPersistence(entity);

            expect(persistence._id).toBe('123');
            expect(persistence.idUtente).toEqual(['user1', 'user2']);
            expect(persistence.url).toBe('https://github.com/owner/repo');
            expect(persistence.pathStorage).toBe('s3://bucket/123');
        });
    });
});