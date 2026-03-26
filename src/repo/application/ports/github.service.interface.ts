export interface GitHubServiceInterface {
    validate(url: string): Promise<boolean>;
}

export const GITHUB_SERVICE = Symbol("GITHUB_SERVICE");