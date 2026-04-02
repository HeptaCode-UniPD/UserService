import { Injectable } from "@nestjs/common";
import { GitHubServiceInterface } from "../application/interfaces/github.service.interface";

export interface GitHubRepoData {
  name: string;
  fullName: string;
}

@Injectable()
export class GitHubAdapter implements GitHubServiceInterface {
    private readonly baseUrl = 'https://api.github.com/repos';

    async validate(url: string): Promise<GitHubRepoData | null> {
        try {
            const { owner, repo } = this.parseUrl(url);
            const response = await fetch(`${this.baseUrl}/${owner}/${repo}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'UserService'
                }
            });
            if(response.status !== 200) return null;
            
            const data = await response.json() as { name: string; full_name: string };
            return { name: data.name, fullName: data.full_name };

        } catch {
            return null;
        }
    }

    private parseUrl(url: string): { owner: string, repo: string } {
        // https://github.com/owner/repo → owner, repo
        const parts = new URL(url).pathname.split('/').filter(Boolean);
        if (parts.length < 2) throw new Error('URL GitHub non valido');
        return { owner: parts[0], repo: parts[1] };
    }
}