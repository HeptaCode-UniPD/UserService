import { GitHubRepoData } from "../../infrastructure/github.adapter";

export interface GitHubServiceInterface {
    validate(url: string): Promise<GitHubRepoData | null>;
}

export const GITHUB_SERVICE = Symbol("GITHUB_SERVICE");