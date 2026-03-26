import { Injectable } from "@nestjs/common";

export interface GitHubServiceInterface {
    validate(url: string): Promise<boolean>;
}

@Injectable()
export class GitHubAdapter implements GitHubServiceInterface {
    private readonly baseUrl = 'https://api.github.com/repos';

    async validate(url: string): Promise<boolean> {
        try {
            const { owner, repo } = this.parseUrl(url);
            const response = await fetch(`${this.baseUrl}/${owner}/${repo}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'UserService'
                }
            });
            return response.status === 200;
        } catch {
            return false;
        }
    }

    private parseUrl(url: string): { owner: string, repo: string } {
        // https://github.com/owner/repo → owner, repo
        const parts = new URL(url).pathname.split('/').filter(Boolean);
        if (parts.length < 2) throw new Error('URL GitHub non valido');
        return { owner: parts[0], repo: parts[1] };
    }
}