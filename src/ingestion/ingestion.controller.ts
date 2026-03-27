import { Controller, Post, Delete, Body, HttpCode, Get } from "@nestjs/common";
import { UserService } from "../user/application/user.service";
import { RepoService } from "../repo/application/repo.service";
import { UserDataDTO } from "./dto/user-data.dto";
import { SingleRepoDataDTO } from "./dto/repo-data.dto";
import { ValidatedUserDataDTO } from "./dto/validated-user-data.dto";
import { ValidatedRepoDataDTO } from "./dto/validated-repo-data.dto";
import { RepoEntity } from "../repo/domain/repo.entity";
import { GetReposDataDTO } from "./dto/get-repo-data.dto";
import { ValidatedGetRepoDataDTO } from "./dto/validated-get-repo-data.dto";

@Controller()
export class IngestionController {
    constructor(
        private readonly userService: UserService,
        private readonly repoService: RepoService,
    ) {}

    @Post('auth/register')
    async register(@Body() body: UserDataDTO): Promise<void> {
        const validated = this.validateUser(body);
        await this.userService.register(validated);
    }

    @Post('auth/login')
    @HttpCode(200)
    async login(@Body() body: UserDataDTO) {
        const validated = this.validateUser(body);
        const result = await this.userService.login(validated);
        return {userId: result.id};
    }

    @Get('repos')
    async getRepos(@Body() body: GetReposDataDTO): Promise<RepoEntity[]> {
        const validated = this.validateGetRepo(body);
        const repos = await this.repoService.getRepos(validated);
        return repos;
    }

    @Post('repo')
    async addRepo(@Body() body: SingleRepoDataDTO): Promise<boolean> {
        const validated = this.validateRepo(body);
        await this.repoService.addRepo(validated);
        return true;
    }

    @Delete('repo')
    @HttpCode(200)
    async deleteRepo(@Body() body: SingleRepoDataDTO): Promise<void> {
        const validated = this.validateRepo(body);
        await this.repoService.deleteRepo(validated);
    }

    private validateUser(data: UserDataDTO): ValidatedUserDataDTO {
        const validated = new ValidatedUserDataDTO();
        validated.email = data.email;
        validated.password = data.password;
        return validated;
    }

    private validateRepo(data: SingleRepoDataDTO): ValidatedRepoDataDTO {
        const validated = new ValidatedRepoDataDTO();
        validated.idUtente = data.idUtente;
        validated.url = data.url;
        return validated;
    }

    private validateGetRepo(data: GetReposDataDTO): ValidatedGetRepoDataDTO {
        const validated = new ValidatedGetRepoDataDTO();
        validated.idUtente = data.idUtente;
        return validated;
    }
}